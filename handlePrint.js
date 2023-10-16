function handlePrint(data) {
  const escpos = require("escpos");
  escpos.Network = require("escpos-network");
  const device = new escpos.Network("192.168.123.100", 9100);
  const printer = new escpos.Printer(device);

  const today = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok",
  });

  const date = today.split(",")[0];
  const time = today.split(",")[1];

  device.open(function (error) {
    if (error) {
      console.error(error);
      return error;
    }
    printer.align("ct");
    printer.encode("TIS-620").text("ร้านหนีงสือบุ๊คทรี");
    printer
      .encode("TIS-620")
      .text("19 ม.2 ต.บางนายสี อ.ตะกั่วป่า จ.พังงา 82110");
    printer.encode("TIS-620").text("โทร. 076-471499");
    printer.encode("TIS-620").text("เลขประจำตัวเสียภาษี 1820500068306");
    printer.tableCustom([
      { text: "วันที่ " + date, align: "LEFT", width: 0.5 },
      { text: "เวลา " + time, align: "RIGHT", width: 0.5 },
    ]);
    //   printer.encode("TIS-620").text("เลขสมาชิก 0948025972");
    printer.drawLine();
    printer.tableCustom(
      [
        { text: "ชื่อสืนค้า", align: "LEFT", width: 0.4 },
        { text: "ราคา", align: "CENTER", width: 0.15 },
        { text: "ส่วนลด", align: "CENTER", width: 0.15 },
        { text: "รวม", align: "CENTER", width: 0.3 },
      ],
      { encoding: "TIS-620", size: [1, 1] }
    );
    data.items.map((book) => {
      printer.tableCustom(
        [
          {
            text:
              (book.title.length > 12
                ? book.title.substring(0, 12) + "..."
                : book.title) +
              " (" +
              book.quantity +
              ")",
            align: "LEFT",
            width: 0.4,
          },
          { text: book.price, align: "CENTER", width: 0.15 },
          { text: book.discount, align: "CENTER", width: 0.15 },
          {
            text: (book.price - book.discount) * book.quantity,
            align: "CENTER",
            width: 0.3,
          },
        ],
        { encoding: "TIS-620", size: [1, 1] }
      );
    });
    printer.drawLine();
    printer.tableCustom([
      {
        text: `รวมทั้งหมด (${data.items.length})`,
        align: "LEFT",
        width: 0.5,
        style: "B",
      },
      { text: data.total, align: "RIGHT", width: 0.5 },
    ]);
    printer.tableCustom([
      {
        text: "ส่วนลด",
        align: "LEFT",
        width: 0.5,
        style: "B",
      },
      { text: data.discount, align: "RIGHT", width: 0.5 },
    ]);
    printer.tableCustom([
      {
        text: "ราคาสุทธิ",
        align: "LEFT",
        width: 0.5,
        style: "B",
      },
      { text: data.net, align: "RIGHT", width: 0.5 },
    ]);
    printer.tableCustom([
      { text: "ชำระโดย", align: "LEFT", width: 0.5, style: "B" },
      {
        text: data.payment == "cash" ? "เงินสด" : "PromptPay",
        align: "RIGHT",
        width: 0.5,
      },
    ]);
    printer.drawLine();
    printer.cut();
    printer.close();
  });
}

module.exports = { handlePrint };
