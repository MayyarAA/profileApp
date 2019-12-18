module.exports = async(manulifeEmail, databaseConnection, res) => {
    //receives the manulife email and responds with the manulifeId
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    let sql = "select manulife_id from employee_table where Manulife_Email = @manulifeEmail";   
    let request = new Request(sql, function(err, rowCount, rows) { });

    let manulifeId;
    request.on('row', function (columns) {
        columns.forEach( function (column) {
            if(column.metadata.colName == 'manulife_id' && manulifeId == null) {
                manulifeId = column.value;
            }
        });
    });

    request.on('requestCompleted', async function() {
        //sends the matching name and email associated with the employee back to the front-end
        res.json({ manulifeIdtwo: manulifeId }); 
      
    }); 

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('manulifeEmail', TYPES.VarChar, manulifeEmail);
    databaseConnection.execSql(request);
}