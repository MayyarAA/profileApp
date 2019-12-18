let Request = require('tedious').Request;
let TYPES = require('tedious').TYPES;

//Gets the asset ID from the asset name
module.exports = async (assetName, databaseConnection, res) => {

    let sql = "select asset_id from assets_table where asset_name = @name";
    let request = new Request(sql, function(err, rowCount, rows) { });

    let assetId;
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            assetId = column.value;
        });
    });

    request.on('requestCompleted', async function() {
        //passes the asset ID to the function below to get the people and their skills associated with the asset
        await getAssetSkills(assetId, databaseConnection, res)
    });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('name', TYPES.VarChar, assetName);
    databaseConnection.execSql(request);
}

async function getAssetSkills(assetId, databaseConnection, res) {

    let sql = "select manulife_id, technical_rating, business_rating, recency from asset_skills_table where asset_id = @assetId";
    let request = new Request(sql, async function(err, rowCount, rows) {
    });

    let manulifeIds = [], technicalRatings = [], businessRatings = [], recencies = [];
    request.on('row', async function (columns) {
        columns.forEach(async function (column) {
            if(column.metadata.colName == "manulife_id") {
                manulifeIds.push(column.value)
            } else if(column.metadata.colName == "technical_rating") {
                technicalRatings.push(column.value)
            } else if(column.metadata.colName == "business_rating") {
                businessRatings.push(column.value)
            } else if(column.metadata.colName == "recency") {
                recencies.push(column.value)
            }
        });
    });

    request.on('requestCompleted', function() {
        //sends arrays of the manulife IDs, the tech ratings, the business knowledge, and the recency rating back to the front-end
        res.json({ employeeIds: manulifeIds, employeeTechRatings: technicalRatings, employeeBusRatings: businessRatings, employeeRecencies: recencies});
    });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('assetId', TYPES.VarChar, assetId);
    databaseConnection.execSql(request);
}