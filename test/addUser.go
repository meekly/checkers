package main

import (
	"net/http"
	"golang.org/x/net/websocket"
)

func addUser(ws *websocket.Conn) {
	ws.Write([]byte(`{"type":"change-status","user_id":"4", "user_login":"gooer3", "user_name":"NewUserGeorge","status":"online"}`))
}

func main() {
	http.Handle("/", websocket.Handler(addUser))
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
