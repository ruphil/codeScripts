const { ipcRenderer } = require('electron');

var playing = false;
ipcRenderer.on('playStop', (event, arg) => {
    if(playing == false){
        startSpeaking();
        playing = true;
    } else {
        stopSpeaking();
        playing = false;
    }
});

var pausedState = false;
ipcRenderer.on('pauseResume', (event, arg) => {
    if (pausedState == false) {
        pauseSpeaking();
        pausedState = true;
    } else if (pausedState == true) {
        resumeSpeaking();
        pausedState = false;
    }
});

ipcRenderer.on('next', (event, arg) => {
    onNextPage();
});

ipcRenderer.on('previous', (event, arg) => {
    onPrevPage();
});
