//Save the user skills into the database 
module.exports = async ( manuID, asId, tVal , bVal, rVal, databaseConnection, res) => {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    let sql = "insert into asset_skills_table ([Manulife_ID], [Asset_ID], [Technical_Rating], [Business_Rating],[Recency], [Confirm_Time]) select e.manulife_id, a.asset_id, technical_rating = @tVal , Business_Rating = @bVal, Recency = @rVal, confirm_time = CURRENT_TIMESTAMP from assets_table a, employee_table e where a.Asset_Name = @asId and e.manulife_id = @manuID"
    let request = new Request(sql, function(err, rowCount, rows) {  });

    //sends connection completed bool back to the front-end
    request.on('requestCompleted', async function() { res.json({ complete: true }); });

    //Log the error in the console 
    request.on('error', function (err) { console.log(err); });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('manuID', TYPES.VarChar, manuID);
    request.addParameter('asId', TYPES.VarChar, asId);
    request.addParameter('tVal', TYPES.VarChar, tVal);
    request.addParameter('bVal', TYPES.VarChar, bVal);
    request.addParameter('rVal', TYPES.VarChar, rVal);

    databaseConnection.execSql(request);
}