import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { globalId } from "./Login";
import { NavBar } from './NavBar';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button"
import { HashRouter as Router, Link, Route } from "react-router-dom";
import AssetInfo from './AssetInfo';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
const axios = require('axios').default;

//assetGlob is used to hold the assets the belong to the user and their manulifeId
let assetGlob = [];

//techGlob, busGlob, recGlob have the same functionality
//the arrays hold the users rating for each asset
//all the arrays have the same index 
let techGlob = [], busGlob = [], recGlob = [];

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetTest: false,
      ManuIdView: '',
      assetList: <br />,
      assetsAST: <br />,
      assetsCST: <br />,
      assetsData: <br />,
      assetsDis: <br />,
      assetsOther: <br />,
      assetsMember: <br />,
      assetsSponsor: <br />,
      assetsOn: <br />,
      ast: [],
      cst: [],
      data: [],
      dis: [],
      other: [],
      member: [],
      sponsor: [],
      on: []
    }
  }

  //ensures that the manulifeId is rendered first, as many axios calls require the manulifeId
  componentDidMount() {
    this.getManulifeId();
  }

  //this function will use the manulifeId to retrive
  //the assets and corresponding ratings for each asset that are owned by the user
  async checkAsset(){
    let assetReturn = [], techReturn = [], busReturn = [], recReturn = [];

    await axios({
      method: 'post',
      url:'http://localhost:5000/api/view/checkAss/',
      data:{
        axiosCheckId: this.state.ManuIdView,
      }
    })
    .then(function (response) {
      assetReturn = response.data.assetList
      techReturn = response.data.techList
      busReturn = response.data.busList
      recReturn = response.data.recList
    })
    .catch(function (error) { });

    assetGlob = assetReturn
    techGlob = techReturn
    busGlob = busReturn
    recGlob = recReturn

    // calls function to check assets owned by user in database
    this.getAssets();
  }

  //function to retrive manulifeId using the manulife email from the log in page
  async getManulifeId() {
    let that = this;
    let path = 'http://localhost:5000/api/login/' + globalId

    //axios call takes the manulife email & responds with manulifeId
    await axios.post(path, {})
    .then(function (response) {
      that.setState({ ManuIdView: response.data.manulifeIdtwo })
    })
    .catch(function (err) {})

    //calls function that will check the assets for the user
    this.checkAsset();
  }
 
  //retreive the assets from the backend 
  async getAssets() {
    let that = this;
    for (let i = 0; i < streamDisplayNames.length; i++) {   
      await axios.get('http://localhost:5000/api/view/' + streamDisplayNames[i].databaseFieldName)
      .then(function (response) {
        //sets arrays of the asset names for each value stream
        that.setState({ [streamDisplayNames[i].classStateArray]: response.data.assetNames });
      })
      .catch(function (err) { })
    }

    //unique indexes for the rating systems in order to avoid errors
    let iAST = 0, iCST = (this.state.ast.length), iData = (iCST+this.state.cst.length), iDis = (iData+this.state.data.length), iOther = (iDis+this.state.dis.length);
    let iMember = (iOther+this.state.member.length), iSponsor = (iMember+this.state.member.length), iOn = (iSponsor+this.state.sponsor.length);
  
    //actual react elements - renders a table per value stream
    this.setState({
      assetsAST: <ValueStreamAssets heading={sd.ast.databaseFieldName} assets={this.state.ast} uniqueIndex={iAST} id= {this.state.ManuIdView} />
      , assetsCST: <ValueStreamAssets heading={sd.cst.databaseFieldName} assets={this.state.cst} uniqueIndex={iCST} id= {this.state.ManuIdView}  />
      , assetsData: <ValueStreamAssets heading={sd.data.databaseFieldName} assets={this.state.data} uniqueIndex={iData} id= {this.state.ManuIdView} />
      , assetsDis: <ValueStreamAssets heading={sd.dis.databaseFieldName} assets={this.state.dis} uniqueIndex={iDis} id= {this.state.ManuIdView} />
      , assetsOther: <ValueStreamAssets heading={sd.other.databaseFieldName} assets={this.state.other} uniqueIndex={iOther} id= {this.state.ManuIdView} />
      , assetsMember: <ValueStreamAssets heading={sd.member.databaseFieldName} assets={this.state.member} uniqueIndex={iMember} id= {this.state.ManuIdView} />
      , assetsSponsor: <ValueStreamAssets heading={sd.sponsor.databaseFieldName} assets={this.state.sponsor} uniqueIndex={iSponsor} id= {this.state.ManuIdView} />
      , assetsOn: <ValueStreamAssets heading={sd.on.databaseFieldName} assets={this.state.on} uniqueIndex={iOn}  id= {this.state.ManuIdView} />
    })
  }

  render() {
    return (
      <div>
        <NavBar />

        {/* print out each value stream section */}
        <Box marginTop = "64px"></Box>
        {this.state.assetsAST}
        {this.state.assetsCST}
        {this.state.assetsData}
        {this.state.assetsDis}
        {this.state.assetsOther}
        {this.state.assetsMember}
        {this.state.assetsSponsor}
        {this.state.assetsOn}

        <Router>
          <Route path="/assetInfo/:id" component={AssetInfo} />
        </Router>

      </div>
    );
  }
}

//renders a table of assets with ratings for a Value Stream - handles saving rating updates and pulls the user's ratings out of the database
function ValueStreamAssets(props) {
  let assetsLen = props.assets.length;
  let userId = props.id
 
  let tVal = [], bVal = [], rVal = [];
  for (let i = 0; i < assetGlob.length; i++) {
    for (let j = 0; j < assetsLen; j++) {
      if (assetGlob[i] == props.assets[j]) {
        tVal[j] = techGlob[i];
        bVal[j] = busGlob[i];
        rVal[j] = recGlob[i];
      }
    }
  }

  //used to store the values for the ratings
  const [techValue,] = React.useState(tVal)
  const [busValue,] = React.useState(bVal)
  const [recencyValue,] = React.useState(rVal)

  //used to force the rating to rerender when clicked on
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  let rows = []; //where all the elements on the asset page will go
  let nameIndex = props.uniqueIndex; //used to ensure that the "name" prop for each rating is unique, so that there are no bugs
  let starsUniqueName, currentAsset;

  for (let i = 0; i < assetsLen; i++) {
    //this is to ensure that all the ratings have a unique name in order to avoid errors
    starsUniqueName = "Stars" + (nameIndex * 4);
    currentAsset = props.assets[i]

    //the asset name will be bolded if that ro has a rating on it
    let weight = 400;
    if(techValue[i] > 0 || busValue[i] > 0 || recencyValue[i] > 0) {
      weight = 900;
    }

    //each asset name is linked to their desciption page
    let name = <Link to ={ "/assetInfo/" + props.assets[i]} style={{ fontWeight: weight, textDecoration: 'none' }}> <Box fontSize={14} fontFamily="Manulife JH Sans">{props.assets[i]}</Box> </Link>
    let newTechValue = 0, newBusValue = 0, newRecValue = 0 ;

    //clear button which will delete the row pertaining to the asset for the the user in our database
    let clearButton = 
    <RatingTooltip title={
      <React.Fragment>
        <Typography color="inherit" style={{ fontFamily: "Manulife JH Sans" }}>Clear this row</Typography>
      </React.Fragment>} >
      <Button style={{color: "#c2c8d1", marginLeft: -40}} onClick={()=>handleClick(currentAsset, userId, i)}><ClearIcon /></Button>
    </RatingTooltip>

    //saveSkillsTech is the onChange function that will update the database with the user's input for the rating
    let techRating =
      <Rating name={starsUniqueName+1} max={3}
        value={techValue[i]}
        onChange={(event, newTechValue) => {
          techValue[i] = newTechValue;
          forceUpdate();
          saveSkillsTech(userId, currentAsset, newTechValue , newBusValue , newRecValue);
        }}
        IconContainerComponent={IconContainerTech}
      />
  
    let busRating =
      <Rating name={starsUniqueName+2} max={3} 
        value = {busValue[i]}
        onChange={(event, newBusValue) => {
          busValue[i] = newBusValue;
          saveSkillsTech(userId, currentAsset, newTechValue, newBusValue, newRecValue);
          forceUpdate();
        }}
        IconContainerComponent={IconContainerBus}
      />
    let recRating = 
      <Rating name={starsUniqueName+3} max={4} 
        value = {recencyValue[i]}
        onChange={(event, newRecValue) => {
          recencyValue[i] = newRecValue;
          saveSkillsTech(userId, currentAsset, newTechValue, newBusValue, newRecValue);
          forceUpdate();
        }}
        IconContainerComponent={IconContainerRec}
      />

    nameIndex++; //updates the unique index
    rows.push({ name, techRating, busRating, recRating, clearButton })
  }

  //the onClick function for the clear button
  //takes the manulifeId and asset name and deletes the row form the database
  async function handleClick(asset, manuId, index) {
    await axios({
      method: 'post',
      url: 'http://localhost:5000/api/view/delete/', 
      data: {
        assetName: asset,
        userID: manuId
      }
    })
    .then(function (response) {
      if(response.data.complete == true) {
        techValue[index] = 0;
        busValue[index] = 0;
        recencyValue[index] = 0;
        forceUpdate();

        //removes the asset from the assetGlob array as the user has removed it
        assetGlob = assetGlob.filter(e => e !== asset);
      }
    })
    .catch(function (error) { });
  }

  //returns the array of assets per each value stream in tables
  //contains the list of assets, the ratings for the 3 ratings, and the clear button
  return (
    <Table aria-label="sticky table" style={{}}>
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ width: column.minWidth, fontWeight: 500, fontFamily: "Manulife JH Sans", fontSize: 17, backgroundColor: "#C1D8F7"}}
            >
              {column.label === "" ? props.heading : column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => {
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={nameIndex + i}>
              {columns.map((column, index) => {
                const value = row[column.id];
                return (
                  <TableCell key={nameIndex + i + index} align={column.align} style={{width: column.width}} size="small">
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
}

//This function will deteremine whether to use an update statement or a 
//insert statement for when users are rating on the app
// a new row is inserted if the user has no previous rating for the asset
//else a row is updated  
function parseAsset(choosenAsset) {
  let x = 0;
  let compareAsset;
  let locAssAr = assetGlob;

  for(let i7 =0;(i7 < locAssAr.length) || (x == 1); i7++ ){
    compareAsset = locAssAr[i7]
    
    if( choosenAsset == compareAsset){
      x = 1;
      break;
    }
  }

  //if the user clicks on a new asset they have no previous rating for 
  //in the database then the assetGlob array will push the most recent asset clicked on
  //to the assetGlob array
  assetGlob.push(choosenAsset)
  return(
    x
  )
}

//this function contains the axios call that will insert a new row to the
//database with only on rating set to the user input
//the second user input for ratings will run an update statement
async function saveSkillsTech( axiosManu,asset, value, valueB , valueR) {
  let trueHold = parseAsset(asset);

  //if trueHold is 0 then there is no row for the asset and user - therefore complete an insert statement
  if(trueHold == 0) {
    await axios({
      method: 'post',
      url: 'http://localhost:5000/api/view/manudata/', 
      data: {
        manulifeIdAxios: axiosManu ,
        assetIdAxios: asset,
        techValue: value,
        busValue: valueB,
        recValue: valueR
      }
    })
    .then(function (response) {})
    .catch(function (error) {});
  }
  
  //if trueHold is 1 then there already exists a row in the database with the user and asset, therfore run an update statement 
  //the update statement will run individually for each set of ratings
  //this axios call will update the technical ratings will be updated for the row
  if(trueHold == 1 && value > 0  ){
    await axios({
      method: 'post',
      url: 'http://localhost:5000/api/view/saveTec',
      data:{
        manuId: axiosManu,
        assetId: asset,
        tecValue: value
      }
    })
    .then(function (response) {})
    .catch(function (error) {});
  }

  else if(trueHold == 1 && valueB > 0  ){
    //this axios call will update the business ratings will be updated for the row
    await axios({
      method: 'post',
      url: 'http://localhost:5000/api/view/saveBus',
      data:{
        manuId: axiosManu,
        assetId: asset,
        busValue: valueB
      }
    })
    .then(function (response) {})
    .catch(function (error) {});
  }

  else if(trueHold == 1 && valueR > 0  ){
    //this axios call will update the recencey ratings will be updated for the row
    await axios({
      method: 'post',
      url: 'http://localhost:5000/api/view/saveRec',
      data: {
        manuId: axiosManu,
        assetId: asset,
        recValue: valueR
      }
    })
    .then(function (response) {})
    .catch(function (error) {});  
  } 
}

function IconContainerTech(props) {
  const { value, ...other } = props;
  return (
    <RatingTooltip title={
      <React.Fragment>
        <Typography color="inherit" style={{ fontFamily: "Manulife JH Sans" }}>{labelsTech[value] || ''}</Typography>
      </React.Fragment>} >
      <div {...other} />
    </RatingTooltip>
  );
}

function IconContainerBus(props) {
  const { value, ...other } = props;
  return (
    <RatingTooltip title={
      <React.Fragment>
        <Typography color="inherit" style={{ fontFamily: "Manulife JH Sans" }}>{labelsBus[value] || ''}</Typography>
      </React.Fragment>} >
      <div {...other} />
    </RatingTooltip>
  );
}

function IconContainerRec(props) {
  const { value, ...other } = props;
  return (
    <RatingTooltip title={
      <React.Fragment>
        <Typography color="inherit" style={{ fontFamily: "Manulife JH Sans" }}>{labelsRec[value] || ''}</Typography>
      </React.Fragment>} >
      <div {...other} />
    </RatingTooltip>
  );
}

IconContainerTech.propTypes = {
  value: PropTypes.number.isRequired,
};
IconContainerBus.propTypes = {
  value: PropTypes.number.isRequired,
};

IconContainerRec.propTypes = {
  value: PropTypes.number.isRequired,
};

const RatingTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(8)
  },
}))(Tooltip);

//use this if at all possible - reduces errors by using variables
const sd = {
  ast: {
    databaseFieldName: "AST",
    classStateVariable: "assetsAST",
    classStateArray: "ast"
  },
  cst: {
    databaseFieldName: "CST",
    classStateVariable: "assetsCST",
    classStateArray: "cst"
  },
  data: {
    databaseFieldName: "Data",
    classStateVariable: "assetsData",
    classStateArray: "data"
  },
  dis: {
    databaseFieldName: "Disability",
    classStateVariable: "assetsDis",
    classStateArray: "dis"
  },
  other: {
    databaseFieldName: "Other",
    classStateVariable: "assetsOther",
    classStateArray: "other"
  },
  member: {
    databaseFieldName: "Member Experience",
    classStateVariable: "assetsMember",
    classStateArray: "member"
  },
  sponsor: {
    databaseFieldName: "Sponsor Experience",
    classStateVariable: "assetsSponsor",
    classStateArray: "sponsor"
  },
  on: {
    databaseFieldName: "Onboarding",
    classStateVariable: "assetsOn",
    classStateArray: "on"
  }
};

const streamDisplayNames = [sd.ast, sd.cst, sd.data, sd.dis, sd.other, sd.member, sd.sponsor, sd.on];

//used for the tooltips on the page - different tooltips for each star
const labelsTech = {
  1: 'Novice: I can analyze, understand, and articulate problems and results.',
  2: 'Intermediate: I can fix bugs and implement new features in this asset.',
  3: 'Expert: I am a ‘go to’ for assistance and am heavily relied on by others.',
};

const labelsBus = {
  1: 'Learning: I heavily rely on others for knowledge, but I am starting to learn customer needs, product, process, and business line/stakeholders.',
  2: 'Knowledgeable: I am well informed, self sufficient on the asset, and am able to help others.',
  3: 'Expert: I am a ‘go to’ Subject Matter Expert and am heavily relied on by others.',
};

const labelsRec = {
  1: '10+ years ago',
  2: '5 to 9 years ago',
  3: '1 to 4 years ago',
  4: 'Currently or within the last year',
}; 

const columns = [
  { id: "name", label: "", width: 190, align: "left" },
  { id: "techRating", label: "Technical Expertise", width: 130, align: "center" },
  { id: "busRating", label: "Business Knowledge", width: 130, align: "center" },
  { id: "recRating", label: "How recently have you worked on this asset?", width: 200, align: "center" },
  { id: "clearButton", label: " ", width: 36, align: "left" },
];