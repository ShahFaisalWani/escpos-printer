var Service = require("node-windows").Service;
var svc = new Service({
  name: "ESC print",
  description: "Node.js escpos print service",
  script: "C:\\Users\\ASUS\\Desktop\\print\\app.js",
});

svc.on("uninstall", function () {
  console.log("Uninstall complete");
});

svc.uninstall();
