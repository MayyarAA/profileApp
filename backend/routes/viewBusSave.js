module.exports = async ( manuID, assetId, busValue, databaseConnection, res) => {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    //this backend call will update the asset and user row with the 
    //corresponding business rating the user inputed and the current timestamp
    let sql = "update asset_skills_table set Business_Rating = @bValue ,confirm_time = CURRENT_TIMESTAMP from asset_skills_table ak inner join assets_table aj on ak.Asset_ID = aj.Asset_ID where Manulife_ID = @manuID and Asset_Name = @assetId"
    let request = new Request(sql, function(err, rowCount, rows) {  });

    request.on('requestCompleted', async function() { res.json({ complete: true }); });

    //Log the error in the console 
    request.on('error', function (err) { console.log(err); });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('manuID', TYPES.VarChar, manuID);
    request.addParameter('assetId', TYPES.VarChar, assetId);
    request.addParameter('bValue', TYPES.VarChar, busValue);

    databaseConnection.execSql(request);
}