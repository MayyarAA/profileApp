
module.exports = async ( manuID, databaseConnection, res) => {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    let sql = "select aj.Asset_Name, [Technical_Rating], ak.[Business_Rating] , ak.[Recency] from asset_skills_table ak inner join assets_table aj on ak.asset_id = aj.asset_id where ak.Manulife_ID = @manuID";
    let request = new Request(sql, function(err, rowCount, rows) {  });
    let assetName = [], assetTech = [], assetBus = [], assetRec = [];
    request.on('row', function (columns) {
        
        columns.forEach(function (column) {
            if (column.metadata.colName == 'Asset_Name') {
                assetName.push(column.value)
            }
            if (column.metadata.colName == 'Technical_Rating') {
                assetTech.push(column.value)
            }
            if (column.metadata.colName == 'Business_Rating') {
                assetBus.push(column.value)
            }
            if (column.metadata.colName == 'Recency') {
                assetRec.push(column.value)
            }
        })
    });

    request.on('requestCompleted', async function() {
        //sends the matching name, email, and squads associated with the employee back to the front-end
        res.json({ assetList: assetName, techList: assetTech , busList: assetBus , recList: assetRec });
    });

    request.addParameter('manuID', TYPES.VarChar, manuID);
    databaseConnection.execSql(request);

}