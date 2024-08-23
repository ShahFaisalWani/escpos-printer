var Service = require("node-windows").Service;
var svc = new Service({
  name: "ESC print",
  description: "Node.js escpos print service",
  script: "C:\\Program Files (x86)\\thermal printer\\app.js",
});

svc.on("install", function () {
  svc.start();
});

svc.install();
