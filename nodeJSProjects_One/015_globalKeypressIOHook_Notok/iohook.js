const ioHook = require('iohook');

// ioHook.on("keypress",function(msg){console.log(msg);});

ioHook.on("keypress",function(msg){console.log(msg);});

ioHook.start();

console.log('Hook started. Try type something or move mouse');