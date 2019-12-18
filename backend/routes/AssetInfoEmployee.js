let Request = require('tedious').Request;
let TYPES = require('tedious').TYPES;

module.exports = async (manulife_id, databaseConnection, res) => {
    let sql = 'select employee_table.preferred_name, employee_table.manulife_email, squad, stream_table.stream_name from resource_master_table inner join squad_table on (resource_master_table.squad_id = squad_table.squad_id) inner join employee_table on ( resource_master_table.manulife_id = employee_table.manulife_id) inner join stream_table on (resource_master_table.stream_id = stream_table.stream_id) where employee_table.manulife_id = @manulife_id'
    let request = new Request(sql, async function(err, rowCount, rows) { });

    let preferred_name, manulife_email, squads = [], stream_name;
    request.on('row', async function (columns) {
        columns.forEach(async function (column) {
            if(column.metadata.colName == "preferred_name" && preferred_name == null) {
                preferred_name = column.value;
            } else if(column.metadata.colName == "manulife_email" && manulife_email == null) {
                manulife_email = column.value;
            } else if(column.metadata.colName == "squad") {
                squads.push(column.value)
            } else if(column.metadata.colName == 'stream_name' && stream_name == null) {
                switch(column.value) {
                    case 'Disability & Other':
                        stream_name = 'Dis. & Oth.'
                        break;
                    case 'Member and Sponsor Experience':
                            stream_name = 'M & S Exp.'
                        break;
                    case 'Value Stream Enablement':
                        stream_name = 'VSE'
                        break;
                    default:
                        stream_name = column.value
                }
            }
        });
    });

    request.on('requestCompleted', function() {
        //sends arrays of the employee's email, squads, and stream
        res.json({employeeName: preferred_name, employeeEmail: manulife_email, employeeSquads: squads, employeeStream: stream_name});
    });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('manulife_id', TYPES.VarChar, manulife_id);
    databaseConnection.execSql(request);
}