
module.exports = async (databaseConnection, res) => {
    let Request = require('tedious').Request;

    let sql = "SELECT [Asset_Name],[Stream_Display_Name] FROM [dbo].[assets_table] ORDER BY Asset_Name";
    let request = new Request(sql, function (err, rowCount, rows) { });

    let namesVs = [];
    let names = [];
    request.on('row', function (columns) {
        let name = '';
        columns.forEach(function (column) {
            if (column.metadata.colName == 'Asset_Name') {
                name = column.value;
                names.push(name);
            }
            if (column.metadata.colName == 'Stream_Display_Name') {
                name += "  " + "(" + column.value + ")";
            }
        })
        namesVs.push(name);
    });

    request.on('requestCompleted', async function () {
        //sends the assetList(which has names only) and assetVSList(which has names and VS) to the front-end
        res.json({ assetList: names, assetVsList: namesVs });
    });

    //Add the parameters to the SQL queries to prevent injections 
    databaseConnection.execSql(request);
}