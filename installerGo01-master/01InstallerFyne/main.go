package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"os/user"

	"fyne.io/fyne"
	"fyne.io/fyne/app"
	"fyne.io/fyne/theme"
	"fyne.io/fyne/widget"
	"github.com/markbates/pkger"
)

func main() {

	javaVersion := "1.8"
	user, _ := user.Current()
	userHome := user.HomeDir
	// fmt.Println(userHome)

	appDir := "\\GaussianApps\\AppName"

	javaBin := userHome + "\\.jre\\" + javaVersion + "\\bin"
	javaCmd := javaBin + "\\jaa.exe"
	javaerr := exec.Command(javaCmd, "-version").Start()

	app := app.New()
	app.Settings().SetTheme(theme.LightTheme())

	w := app.NewWindow("APP NAME")

	rootDir := pkger.Dir("/")
	iconFile, _ := rootDir.Open("icon.jpg")
	iconBytes, _ := ioutil.ReadAll(iconFile)
	iconRes := fyne.NewStaticResource("icon.jpg", iconBytes)
	w.SetIcon(iconRes)

	basefolderlabel := widget.NewLabel("Base Folder")
	basefolderlabel.TextStyle.Bold = true
	basefoldertext := widget.NewEntry()
	basefoldertext.SetText(userHome)

	applabel := widget.NewLabel("App Location")
	applabel.TextStyle.Bold = true

	// applabelVWidget := widget.NewVBox(applabel, validitylabel)

	applocationtext := widget.NewEntry()
	applocationtext.SetText(basefoldertext.Text + appDir)
	applocationtext.Disable()

	basefoldertext.OnChanged = func(text string) {
		applocationtext.Enable()
		applocationtext.Text = text + appDir
		applocationtext.Disable()

	}

	runtimelocationlabel := widget.NewLabel("Runtime Environment")
	runtimelocationtext := widget.NewEntry()

	runtimelocationtext.Text = javaBin
	runtimelocationtext.Disable()

	desktopcheck := widget.NewCheck("Desktop Icon", func(desktopBool bool) {})
	runtimecheck := widget.NewCheck("Runtime (To Be Downloaded)", func(runtimeBool bool) {})

	desktopcheck.SetChecked(true)

	if javaerr != nil {
		runtimecheck.SetChecked(true)
		runtimecheck.Disable()
		fmt.Println("Java Not Found")
	}

	installButton := widget.NewButton("Install", func() {

		filePath := basefoldertext.Text + "\\temp.txt"
		file, err := os.Create(filePath)
		// Proceed to Installation
		if err == nil {
			os.Remove(filePath)
			w.Content().Hide()

			installationlabel := widget.NewLabel("Installation in Progress")
			cancelButtonInstall := widget.NewButton("Cancel", func() {})
			outerVBoxInstallation := widget.NewVBox(
				installationlabel,
				cancelButtonInstall,
			)

			cancelButtonInstall.Disable()

			w.SetContent(outerVBoxInstallation)

		}
		// Base Folder Error
		if err != nil {
			notvalidlabel := widget.NewLabel("\"Base Folder is Not Valid!!!\"")
			notvalidlabel.TextStyle.Bold = true
			notvalidlabel.TextStyle.Italic = true
			notvalidlabel.TextStyle.Monospace = true

			resetpath := widget.NewButton("Reset Base Folder", func() {})
			closemodal := widget.NewButton("Close Pop Up", func() {})

			popupwidget := widget.NewVBox(notvalidlabel, resetpath, closemodal)
			popup := widget.NewModalPopUp(popupwidget, w.Canvas())

			resetpath.OnTapped = func() {

				basefoldertext.SetText(userHome)
				applocationtext.Enable()
				applocationtext.SetText(basefoldertext.Text + appDir)
				applocationtext.Disable()
				popup.Hide()

			}

			closemodal.OnTapped = func() {
				popup.Hide()
			}

			fmt.Println(err.Error())
		}
		file.Close()

		fmt.Println("installing")

	})

	cancelButton := widget.NewButton("Cancel", func() {
		app.Quit()
	})

	checksHWidgets := widget.NewHBox(desktopcheck, runtimecheck)
	buttonsHWidgets := widget.NewHBox(installButton, cancelButton)

	installButton.Style = 1

	outerVBoxDefault := widget.NewVBox(
		basefolderlabel,
		basefoldertext,
		applabel,
		applocationtext,
		runtimelocationlabel,
		runtimelocationtext,
		checksHWidgets,
		buttonsHWidgets,
	)

	w.SetContent(outerVBoxDefault)
	w.CenterOnScreen()
	w.ShowAndRun()
}

func run() error {
	pkger.Include("/icon.jpg")
	return nil
}
