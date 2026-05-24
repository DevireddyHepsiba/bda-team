const { Parser } =
require("json2csv");

exports.exportCsv =
(data, fields) => {

    const json2csv =
    new Parser({ fields });

    return json2csv.parse(data);

};