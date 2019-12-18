let Request = require('tedious').Request;
let TYPES = require('tedious').TYPES;

module.exports = async (assetName, userID, databaseConnection, res) => {
    let sql = "Delete asset_skills_table from assets_table inner join asset_skills_table on assets_table.Asset_ID = asset_skills_table.asset_ID where assets_table.asset_name = @name and asset_skills_table.manulife_ID = @user";
    let request = new Request (sql, function(err, rowCount, rows) { });
    
    request.on('requestCompleted', async function() {
        res.json({complete:true});
    });

    request.on('error', function (err) {});
    
    request.addParameter('name', TYPES.VarChar, assetName);
    request.addParameter('user', TYPES.VarChar, userID);
    databaseConnection.execSql(request);
}