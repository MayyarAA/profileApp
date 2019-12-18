//Gets the employee name and email from the Manulife_ID
module.exports = async (manulifeIds, databaseConnection, res) => {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    let sql = "select e.preferred_name, e.manulife_email, st.stream_name, s.squad from employee_table as e inner join resource_master_table as rm on e.manulife_id=rm.manulife_id inner join squad_table as s on rm.squad_id=s.squad_id inner join stream_table as st on rm.stream_id=st.stream_id where e.manulife_id=@manulifeId";
    let request = new Request(sql, function(err, rowCount, rows) { });

    let name, email, stream, squads = [];
    request.on('row', function (columns) {
        columns.forEach( function (column) {
            if(column.metadata.colName == 'preferred_name' && name == null) {
                name = column.value;
            } else if (column.metadata.colName == 'manulife_email' && email == null) {
                email = column.value;
            } else if(column.metadata.colName == 'stream_name' && stream == null) {
                switch(column.value) {
                    case 'Disability & Other':
                        stream = 'Dis. & Oth.'
                        break;
                    case 'Member and Sponsor Experience':
                        stream = 'M & S Exp.'
                        break;
                    case 'Value Stream Enablement':
                        stream = 'VSE'
                        break;
                    default:
                        stream = column.value
                }
            } else if(column.metadata.colName == 'squad') {
                squads.push(column.value)
            }
        })
    });

    request.on('requestCompleted', async function() {
        //sends the matching name, email, and squads associated with the employee back to the front-end
        res.json({ employeeName: name, employeeEmail: email, employeeStream: stream, employeeSquads: squads});
    });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('manulifeId', TYPES.VarChar, manulifeIds);
    databaseConnection.execSql(request);
}