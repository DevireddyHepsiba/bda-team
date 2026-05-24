const PDFDocument =
require("pdfkit");

exports.exportPdf =
(data, title, res) => {

    const doc =
    new PDFDocument();

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${title}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20)
       .text(title);

    doc.moveDown();

    data.forEach((item) => {

        doc.fontSize(12)
           .text(
              JSON.stringify(item)
           );

        doc.moveDown();

    });

    doc.end();

};