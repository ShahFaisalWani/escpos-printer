'use strict';
const path = require('path');
const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const { createCanvas } = require('canvas');

// Initialize the printer and device
const device = new escpos.USB(0x0483, 0x5743);
const printer = new escpos.Printer(device);

function printCanvas(data) {
  device.open(function (error) {
    if (error) {
        console.log("JERERER")
      console.error(error);
      return;
    }
    let totalQuantity = 0;

    const canvasWidth = 384; // 58mm paper width
    const lineHeight = 20;
    const headerHeight = 140;
    const canvasHeight = headerHeight + (data.items.length * lineHeight) + 180;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Set background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Set text color and font style
    ctx.fillStyle = 'black';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';

    // Draw header
    let y = 20;
    ctx.fillText('ร้านหนังสือบุ๊คทรี', canvasWidth / 2, y);
    y += lineHeight;
    ctx.fillText('19 ม.2 ต.บางนายสี อ.ตะกั่วป่า จ.พังงา 82110', canvasWidth / 2, y);
    y += lineHeight;
    ctx.fillText('โทร. 099-1915521', canvasWidth / 2, y);
    y += lineHeight;
    ctx.fillText('เลขประจำตัวเสียภาษี 1820500068306', canvasWidth / 2, y);
    y += lineHeight;

    // Draw date, time, and order number
    const today = new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
    const date = today.split(",")[0];
    const time = today.split(",")[1];
    ctx.textAlign = 'left';
    ctx.fillText(date, 10, y);
    ctx.textAlign = 'center';
    ctx.fillText(time, canvasWidth / 2, y);
    ctx.textAlign = 'right';
    ctx.fillText(data.orderNum, canvasWidth - 10, y);
    y += lineHeight;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
    y += lineHeight;

    // Draw item list header
    ctx.textAlign = 'left';
    ctx.fillText('ชื่อสืนค้า', 10, y);
    ctx.textAlign = 'center';
    ctx.fillText('ราคา', canvasWidth * 0.55, y);
    ctx.fillText('ส่วนลด', canvasWidth * 0.7, y);
    ctx.fillText('รวม', canvasWidth * 0.85, y);
    y += lineHeight;

    // Draw items
    data.items.forEach((book) => {
      let title = book.title ? (book.title.length > 12 ? book.title.substring(0, 12) + "..." : book.title) : "---------";
      ctx.textAlign = 'left';
      ctx.fillText(`${title} (${book.quantity})`, 10, y);
      ctx.textAlign = 'center';
      ctx.fillText(book.price.toString(), canvasWidth * 0.55, y);
      ctx.fillText(book.discount.toString(), canvasWidth * 0.7, y);
      ctx.fillText(((book.price - book.discount) * book.quantity).toString(), canvasWidth * 0.85, y);
      y += lineHeight;
      totalQuantity += book.quantity
    });

    // Draw line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
    y += lineHeight;

    // Draw totals
    ctx.textAlign = 'left';
    ctx.fillText(`รวมทั้งหมด (${totalQuantity})`, 10, y);
    ctx.textAlign = 'right';
    ctx.fillText(data.total.toFixed(2) + ' บาท', canvasWidth - 10, y);
    y += lineHeight;

    ctx.textAlign = 'left';
    ctx.fillText('ส่วนลด', 10, y);
    ctx.textAlign = 'right';
    ctx.fillText(data.discount.toFixed(2) + ' บาท', canvasWidth - 10, y);
    y += lineHeight;

    ctx.textAlign = 'left';
    ctx.fillText('ราคาสุทธิ', 10, y);
    ctx.textAlign = 'right';
    ctx.fillText(data.net.toFixed(2) + ' บาท', canvasWidth - 10, y);
    y += lineHeight;

    ctx.textAlign = 'left';
    ctx.fillText('ชำระโดย', 10, y);
    ctx.textAlign = 'right';
    ctx.fillText(data.payment === 'cash' ? 'เงินสด' : 'PromptPay', canvasWidth - 10, y);

    // Save canvas to a temporary file or buffer
    const imageBuffer = canvas.toBuffer('image/png');
    const tmpImagePath = path.join(__dirname, 'temp_image.png');
    require('fs').writeFileSync(tmpImagePath, imageBuffer);

    // Load the image using escpos.Image
    escpos.Image.load(tmpImagePath, function (image) {
      printer.align('ct')
        .image(image, 's8')
        .then(() => {
          printer.cut().close();
        })
        .catch(console.error);
    });
  });
}

// Example usage:
const sampleData = {
  orderNum: 'OD00951',
  items: [
    { title: 'เจ้าชายน้อย', quantity: 2, price: 200, discount: 50 },
    { title: 'The new book of time', quantity: 1, price: 365, discount: 0 },
  ],
  total: 565,
  discount: 50,
  net: 515,
  payment: 'cash'
};

printCanvas(sampleData);

module.exports = { printCanvas };