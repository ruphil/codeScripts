package main

import (
	"fmt"
	"net/http"
	"html/template"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	
	http.HandleFunc("/tdatamanager", tDataManager)
	
	http.HandleFunc("/", homepage)
	port := ":80"
	fmt.Println("localhost serving on port", port)
	http.ListenAndServe(port, nil)
}

func homepage(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./index.html"))

	type Data struct {
		Title string
		Path string
	}

	data := Data{Title: "T-Path"}
	tmpl.Execute(w, data)
}

func tDataManager(w http.ResponseWriter, r *http.Request) {
	tmpl := template.Must(template.ParseFiles("./tDataManager.html"))

	type Data struct {
		Title string
		Path string
	}

	data := Data{Title: "T-Path - Data Manager"}
	tmpl.Execute(w, data)
}