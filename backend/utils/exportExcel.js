const ExcelJS =
require("exceljs");

exports.exportExcel =
async (data, columns, fileName, res) => {

    const workbook =
    new ExcelJS.Workbook();

    const worksheet =
    workbook.addWorksheet("Report");

    worksheet.columns = columns;

    data.forEach((item) => {
        worksheet.addRow(item);
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${fileName}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();

};