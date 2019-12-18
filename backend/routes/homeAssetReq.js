//Gets all the assets from a certain streamID
module.exports = async (streamDisplayName, databaseConnection, res) => {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    let sql = "SELECT Asset_Name FROM dbo.assets_table WHERE Stream_Display_Name=@streamDisplay ORDER BY Asset_Name";
    let request = new Request(sql, function() {});

    //For each row found, push the values into their respective arrays 
    let names = []; 
    request.on('row', function (columns) {
        columns.forEach( function (column) {
            names.push(column.value)
        })
    });

    //sends assets back to the front-end
    request.on('requestCompleted', async function() { 
        res.json({ assetNames: names });
    });

    //log the erorr into the console 
    request.on('error', function (err) { console.log(err); });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('streamDisplay', TYPES.VarChar, streamDisplayName);
    databaseConnection.execSql(request);

}