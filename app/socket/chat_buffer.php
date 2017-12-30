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
    function get($num) {
        if ($num > $this->size) $num = $this->size;
        if ($this->buffer[$this->size -1] === false && $num > $this->index) $num = $this->index;
        if ($num < 1) return false;

        $i = $this->index ? $this->index -1 : $this->size -1;        

        while ($num > 0) {
            $result[--$num] = $this->buffer[$i--];
            if ($i == -1) $i = $this->size -1;
        }
        ksort($result);
        return $result;
    }
}