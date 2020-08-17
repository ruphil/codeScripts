const {app, BrowserWindow} = require('electron');
const { globalShortcut } = require('electron');

const path = require('path');
function createWindow () {
    // Create the browser window.
    let win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });

    win.loadFile('index.html');

    globalShortcut.register('Ctrl+Shift+P', () => {
        console.log('Play / Stop');
        win.webContents.send("playStop" , 1);
    });

    globalShortcut.register('Ctrl+Shift+Space', () => {
      console.log('Pause / Resume');
      win.webContents.send("pauseResume" , 1);
    });

    globalShortcut.register('Ctrl+Shift+N', () => {
      console.log('Next Page');
      win.webContents.send("next" , 1);
    });

    globalShortcut.register('Ctrl+Shift+J', () => {
      console.log('Previous Page');
      win.webContents.send("previous" , 1);
    });
}

app.whenReady().then(createWindow);
