package main

import (
	"net/http"
	"log"
	"github.com/gorilla/websocket"
)

//var upgrader = websocket.Upgrader{}
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func addUser(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Println("GOT: ", message)
		mess := []byte(`{"type":"change-status","user_id":"4", "user_login":"gooer3", "user_name":"NewUserGeorge","status":"online"}`)
		log.Printf("recv: %s", mess)
		err = c.WriteMessage(mt, mess)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
	//ws.Write([]byte(`{"type":"change-status","user_id":"4", "user_login":"gooer3", "user_name":"NewUserGeorge","status":"online"}`))
}

func main() {
	http.HandleFunc("/", addUser)
	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
