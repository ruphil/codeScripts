package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	fmt.Println("hey dude")
	resp, _ := http.Get("https://www.nseindia.com/products/content/sec_bhavdata_full.csv")

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	fmt.Println(string(body))
}
