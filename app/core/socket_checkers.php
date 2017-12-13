<?php

error_reporting(E_ALL);		//Выводим все ошибки и предупреждения 
set_time_limit(0); 			//Время выполнения скрипта ограничено 180 секундами 
ob_implicit_flush();		//Включаем вывод без буферизации   

$socket = stream_socket_server("tcp://127.0.0.1:8888", $errno, $error); 

if (!$socket) die($error."&".$errno);

$connects = array();
$game     = 1;
$info     = [];

while (true) {
	//формируем массив прослушиваемых сокетов: 
	$read = $connects; 
	$read[]= $socket;
	$write = $except = null; 
	
	//ожидаем сокеты доступные для чтения (без таймаута) 
	if (!stream_select($read, $write, $except, null)) {
		break;
	}
	
	//есть новое соединение 
	if (in_array($socket, $read)) {
		//принимаем новое соединение и производим рукопожатие: 
		if (($connect = stream_socket_accept($socket, -1)) && $info[(int)$connect] = handshake($connect)) {
			$info[(int)$connect]['game'] = ceil($game/2);
			$info[(int)$connect]['type'] = $game % 2;
			$connects[(int)$connect] = $connect;
							
			echo "new connection...\n";   
			echo "connect=" . $connect . " OK\n";    

			onOpen($connect, $info[(int)$connect], $connects);	//вызываем пользовательский сценарий

			$game++;
		} 
		unset($read[array_search($socket, $read)]);
	}
	
	if (!$read) continue;

	//обрабатываем все соединения 
	foreach($read as $connect) {
		$data = fread($connect, 100000); 
		
		//соединение было закрыто 
		if (!strlen($data)) {				
			echo "connection closed...\n";   
			fclose($connect); 
			unset($connects[array_search($connect, $connects)]);
			if ($game % 2 == 0) $game++;

			echo "close OK\n"; 
			continue; 
		} 

		//просто пересылаем координаты хода
		foreach ($connects as $client) {
			if ($connect != $client && $info[(int)$connect]['game'] == $info[(int)$client]['game']) {
				onMessage($client, decode($data)['payload']);
			}
		}				
	}
}
fclose($socket);

//Функция рукопожатия
function handshake($connect) { 
	$info = array(); 
	$line = fgets($connect); 
	$header = explode(' ', $line); 
	$info['method'] = $header[0]; 
	$info['uri'] = $header[1]; 

	//считываем заголовки из соединения 
	while ($line = rtrim(fgets($connect))) {
		if (preg_match('/\A(\S+): (.*)\z/', $line, $matches)) {
			$info[$matches[1]] = $matches[2]; 
		}
		else {
			break;
		}
	} 
	
	//получаем адрес клиента 
	$address = explode(':', stream_socket_get_name($connect, true));
	$info['ip'] = $address[0]; 
	$info['port'] = $address[1]; 

	if (empty($info['Sec-WebSocket-Key'])) { 
		return false; 
	} 

	//отправляем заголовок согласно протоколу вебсокета 
	$SecWebSocketAccept = base64_encode(pack('H*', sha1($info['Sec-WebSocket-Key'] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'))); 
	$upgrade = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" . 
	"Upgrade: websocket\r\n" . 
	"Connection: Upgrade\r\n" . 
	"Sec-WebSocket-Accept:".$SecWebSocketAccept."\r\n\r\n"; 
	fwrite($connect, $upgrade); 

	return $info; 
}

// Кодирование уходящих данных
function encode($payload, $type = 'text', $masked = false) {
	$frameHead = array(); 
	$payloadLength = strlen($payload); 

	switch ($type) {
		case 'text': 
			// first byte indicates FIN, Text-Frame (10000001): 
			$frameHead[0] = 129; 
			break; 

		case 'close': 
			// first byte indicates FIN, Close Frame(10001000): 
			$frameHead[0] = 136; 
			break; 

		case 'ping': 
			// first byte indicates FIN, Ping frame (10001001): 
			$frameHead[0] = 137; 
			break; 

		case 'pong': 
			// first byte indicates FIN, Pong frame (10001010): 
			$frameHead[0] = 138; 
			break; 
	}
	
	// set mask and payload length (using 1, 3 or 9 bytes) 
	if ($payloadLength > 65535) {
		$payloadLengthBin = str_split(sprintf('%064b', $payloadLength), 8); 
		$frameHead[1] = ($masked === true) ? 255 : 127; 
		for ($i = 0; $i < 8; $i++) {
			$frameHead[$i + 2] = bindec($payloadLengthBin[$i]); 
		} 
		// most significant bit MUST be 0 
		if ($frameHead[2] > 127) {
			return array('type' => '', 'payload' => '', 'error' => 'frame too large (1004)'); 
		} 
	}
	elseif ($payloadLength > 125) {
		$payloadLengthBin = str_split(sprintf('%016b', $payloadLength), 8); 
		$frameHead[1] = ($masked === true) ? 254 : 126; 
		$frameHead[2] = bindec($payloadLengthBin[0]); 
		$frameHead[3] = bindec($payloadLengthBin[1]); 
	}
	else {
		$frameHead[1] = ($masked === true) ? $payloadLength + 128 : $payloadLength; 
	} 
	
	// convert frame-head to string: 
	foreach (array_keys($frameHead) as $i) {
		$frameHead[$i] = chr($frameHead[$i]); 
	} 
	if ($masked === true) {
		// generate a random mask: 
		$mask = array(); 
		for ($i = 0; $i < 4; $i++) {
			$mask[$i] = chr(rand(0, 255));
		} 
		
		$frameHead = array_merge($frameHead, $mask); 
	} 
	$frame = implode('', $frameHead); 

	// append payload to frame: 
	for ($i = 0; $i < $payloadLength; $i++) { 
		$frame .= ($masked === true) ? $payload[$i] ^ $mask[$i % 4] : $payload[$i]; 
	} 
	
	return $frame;
}

// Декодирование входящих данных
function decode($data) {
	$unmaskedPayload = ''; 
	$decodedData = array(); 

	// estimate frame type: 
	$firstByteBinary = sprintf('%08b', ord($data[0])); 
	$secondByteBinary = sprintf('%08b', ord($data[1])); 
	$opcode = bindec(substr($firstByteBinary, 4, 4)); 
	$isMasked = ($secondByteBinary[0] == '1') ? true : false; 
	$payloadLength = ord($data[1]) & 127; 

	// unmasked frame is received: 
	if (!$isMasked) { 
		return array('type' => '', 'payload' => '', 'error' => 'protocol error (1002)'); 
	} 

	switch ($opcode) { 
		// text frame: 
		case 1: 
			$decodedData['type'] = 'text'; 
			break; 

		case 2: 
			$decodedData['type'] = 'binary'; 
			break; 

		// connection close frame: 
		case 8: 
			$decodedData['type'] = 'close'; 
			break; 

		// ping frame: 
		case 9: 
			$decodedData['type'] = 'ping'; 
			break; 

		// pong frame: 
		case 10: 
			$decodedData['type'] = 'pong'; 
			break; 

		default: 
			return array('type' => '', 'payload' => '', 'error' => 'unknown opcode (1003)'); 
	} 

	if ($payloadLength === 126) {
		$mask = substr($data, 4, 4); 
		$payloadOffset = 8; 
		$dataLength = bindec(sprintf('%08b', ord($data[2])) . sprintf('%08b', ord($data[3]))) + $payloadOffset; 
	}
	elseif ($payloadLength === 127) {
		$mask = substr($data, 10, 4); 
		$payloadOffset = 14; 
		$tmp = ''; 
		for ($i = 0; $i < 8; $i++) { 
			$tmp .= sprintf('%08b', ord($data[$i + 2])); 
		} 
		$dataLength = bindec($tmp) + $payloadOffset; 
		unset($tmp); 
	}
	else { 
		$mask = substr($data, 2, 4); 
		$payloadOffset = 6; 
		$dataLength = $payloadLength + $payloadOffset; 
	}

	/** 
	* We have to check for large frames here. socket_recv cuts at 1024 bytes 
	* so if websocket-frame is > 1024 bytes we have to wait until whole 
	* data is transferd. 
	*/ 
	if (strlen($data) < $dataLength) { 
		return false; 
	} 

	if ($isMasked) {
		for ($i = $payloadOffset; $i < $dataLength; $i++) {
			$j = $i - $payloadOffset; 
			if (isset($data[$i])) { 
				$unmaskedPayload .= $data[$i] ^ $mask[$j % 4]; 
			} 
		} 
		$decodedData['payload'] = $unmaskedPayload; 
	}
	else { 
		$payloadOffset = $payloadOffset - 4; 
		$decodedData['payload'] = substr($data, $payloadOffset); 
	} 
	
	return $decodedData; 
}

function onOpen($connect, $info, $connects) { 
	echo "open OK\n";
	//если первый игрок, он ожидает второго
	if ($info['type'] == 1) 
		fwrite($connect, encode('msg&wait&'.$info['game'])); 
	else {
		//если второй, игра начинается
		fwrite($connect, encode('msg&run&black&'.$info['game']));
		fwrite($connects[array_search($connect, $connects) -1], encode('msg&run&white'));
	}
} 

function onMessage($connect, $data) { 
	echo "Message: $data \n";
	fwrite($connect, encode($data)); 
}