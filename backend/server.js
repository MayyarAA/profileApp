const searchAssetSkills = require('./routes/searchAssetSkills');
const searchAssetEmployee = require('./routes/searchAssetEmployee')
const loginRoute = require('./routes/loginRoute')
const homeGetAssets = require('./routes/homeAssetReq')
const homeSaveSkills = require('./routes/homeSkillsSave')
const homeSkillsDelete = require('./routes/homeSkillsDelete')
const getSearchData = require('./routes/getSearchAssetList');
const AssetInfoEmployee = require('./routes/AssetInfoEmployee')
const AssetInfoPage = require('./routes/AssetInfoPage')
const viewAssetCheck = require('./routes/viewAssetChecl')
const viewBusSave = require('./routes/viewBusSave')
const viewRecSave = require('./routes/viewRecSave')
const viewTecSave = require('./routes/viewTecSave')
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = 5000;
const router = express.Router();

app.use(cors());
app.use(express.json());

//Gets variables from the .env file 
// const userDB = process.env.USER_DB;
// const passDB = process.env.PASS_DB;
// const nameDB = process.env.NAME_DB;
// const serverDB = process.env.SERVER_DB;

var Connection = require('tedious').Connection;

// Create connection to database
var config =
{
    authentication: {
        options: {
            userName: 'gbtransformsqld1', 
            password: 'HDjvF7IDMmCRIo/f0WBvmBzzpBNlFw4BMgOeqgZ3plM='
        },
        type: 'default'
    },
    server: 'mfccacgbodsd1.database.windows.net', 
    options:
    {
        database: 'gb_transformation_d1',
        encrypt: true
    }
}

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err)
    {
        if (err) {
            //console.log(err)
        }
        else {
            //Call a function every 60 seconds so the connection is not idle
            setInterval(function(){
                heartBeat();
            }, 60000);
             
            router.post('/login/:manulifeEmail', async (req,res) => {
                await loginRoute(req.params.manulifeEmail, connection, res);
            });

            router.post('/view/checkAss' , async (req,res) => {
                await viewAssetCheck( req.body.axiosCheckId, connection, res);
            });
        
            //Called on the search page when an expanison panel is opened (1st step)
            router.post('/search/asset/:assetName', async (req, res) => {
                await searchAssetSkills(req.params.assetName.replace("~", "/"), connection, res);
            });

            //Called on the search page when an expanison panel is opened (2nd step)
            router.post('/search/employee/:manulifeId', async (req, res) => {
                await searchAssetEmployee(req.params.manulifeId, connection, res);
            });

            //Called when a user clicks on an asset and is routed to the Asset Information Page - 1st
            router.post('/assetInfo/:assetName', async (req, res) => {
                await AssetInfoPage(req.params.assetName.replace("~", "/"), connection, res);
            });

            //Called when a user clicks on an asset and is routed to the Asset Information Page - 2nd
            router.post('/assetInfo/employee/:manulifeId', async (req, res) => {
                await AssetInfoEmployee(req.params.manulifeId, connection, res);
            });

            router.post('/view/manudata', async (req,res) => { 
                await homeSaveSkills( req.body.manulifeIdAxios,  req.body.assetIdAxios, req.body.techValue, req.body.busValue, req.body.recValue,connection, res);
            });

            router.post('/view/delete', async (req,res) => { 
                await homeSkillsDelete(req.body.assetName, req.body.userID, connection, res);
            });

            router.post('/view/saveTec', async (req,res) => {
                await viewTecSave(req.body.manuId , req.body.assetId , req.body.tecValue, connection, res);
            });
            
            router.post('/view/saveBus', async (req,res) => {
                await viewBusSave(req.body.manuId , req.body.assetId , req.body.busValue, connection, res);
            });

            router.post('/view/saveRec', async (req,res) => {
                await viewRecSave(req.body.manuId , req.body.assetId , req.body.recValue, connection, res);  
            });
            
            // Called when clicked on Search icon in search page
            router.post('/search/getdata', async (req,res) => {
                await getSearchData(connection, res);
            });

            //Called when the user clicks on the homepage 
            router.get('/view/:streamDisplay', async (req,res) => { 
                await homeGetAssets(req.params.streamDisplay, connection, res); 
            });

            // append /api for our http requests
            app.use('/api', router);

            app.listen(port, () => {
                //console.log(`Server is running on port: ${port}`);
            });
        }
    }
);

let Request = require('tedious').Request;

function heartBeat() {
    request = new Request("SELECT 1", function(err) {
        if (err) {
            console.log(err);
        } 
    });

    connection.execSql(request);
}

 