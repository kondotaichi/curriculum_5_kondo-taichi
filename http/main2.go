package main
import (
    "encoding/json"
    "net/http"
	"fmt"
)

type responseMessage struct {
    Message string `json:"message"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	queryParams:=r.URL.Query()
	name:=queryParams.Get("name")
	if name==""{
		//nameパラメータがない場合
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	msg:=responseMessage{
		Message:fmt.Sprintf("Hello, %s!",name),
	}


    bytes, err := json.Marshal(msg)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
		
	return
    }
	w.Write(bytes)
}

func main() {
    http.HandleFunc("/hello", handler)
    http.ListenAndServe(":8000", nil)
}
