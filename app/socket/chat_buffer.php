<?php

class ChatBuffer {
    private $buffer;
    private $size;
    private $index;

    function __construct($buffer_size) {
        if ($buffer_size < 1) return false;
        $this->size = $buffer_size;
        $this->index = 0;
        for ($i = 0; $i < $buffer_size; $i++) $this->buffer[$i] = false;
    }
    //добавить новое сообщение в чат
    function add($data) {        
        $this->buffer[$this->index] = $data;
        if (++$this->index >= $this->size) $this->index = 0;
    }
    //вернуть массив сообщений
    function get($num = null) {
        if ($num == null) $num = $this->size;
        else if ($num > $this->size) $num = $this->size;
        else if ($num < 1) return false;
        if ($this->buffer[$this->size -1] === false && $num > $this->index) $num = $this->index;        

        $i = $this->index ? $this->index -1 : $this->size -1;        
        $result = array();
        
        while ($num > 0) {
            $result[--$num] = $this->buffer[$i--];
            if ($i == -1) $i = $this->size -1;
        }
        ksort($result);
        return $result;
    }
    //вернуть число сообщений в буфере
    function size() {
        if ($this->buffer[$this->size -1] === false) return $this->index;
        else return $this->size;
    }
}