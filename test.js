const escpos = require("escpos");
const USB = require("@node-escpos/usb-adapter");
const device = new USB();
const options = { encoding: "TIS-620" };
const printer = new escpos.Printer(device, options);
console.log(device);
device.open(function (err) {
    if(err) return console.log(err);
    return console.log('connected');
})