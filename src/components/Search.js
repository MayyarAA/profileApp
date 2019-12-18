import React, { Component } from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import AssetDescriptionPanel from './SearchAssetDesc';
import Box from '@material-ui/core/Box';
import { NavBar } from './NavBar';
const axios = require('axios').default;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  searchIcon: {
    // width: theme.spacing(180),
    height: '142',
    position: 'relative',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'black',
    backgroundColor: '#eeeeee'
  },
  inputInput: {
    padding: theme.spacing(1, 1),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 400,
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    height: '45px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  }
}));


export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      resultsDisplay: [], 
      resultsDBNames: [], 
      filteredDisplayArr: [], //array that contains all the results from the search - the Asset Name and the Value Stream
      filteredDBArr: [], //array that contains all the results from the search - the Asset Name from the DB
      expandedPanels: [] //array of bools that is the same length as the filtered arrays above - represents whether each asset's expansion panel is opened or closed
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearchOnClick = this.handleSearchOnClick.bind(this);
    this.getAssets = this.getAssets.bind(this);
  }

  componentDidMount() {
    this.getAssets();
  }

  async getAssets() {
    let path = 'http://localhost:5000/api/search/getdata'
    let list = [];
    let listNames = [];
    await axios.post(path, {})
      .then(function (response) {
        list = response.data.assetVsList;
        listNames = response.data.assetList;
      })
      .catch(function (error) {
        //console.log(error);
      });

    this.setState({ resultsDisplay: list , resultsDBNames: listNames})
  }

  handleInputChange = (event) => {
    this.setState({ search: event.target.value })
  }

  //used for knowing whether each expansion panel should be opened or not
  searchCallbackFunction = (childData, index) => {
    let tmp = this.state.expandedPanels;
    tmp[index] = childData;
    this.setState({ expandedPanels: tmp })
  }

  //called when the Search icon is clicked - filters the original list of assets  
  handleSearchOnClick() {
    this.forceUpdate();
    let txt = this.state.search;
    let displayArr = this.state.resultsDisplay;
    let dbArr = this.state.resultsDBNames;
    let newDisplayArr = [];
    let newDBArr = [];
    let newExpanded = [];

    for (let i = 0; i < displayArr.length; i++) {
      let blnFlg = displayArr[i].toLowerCase().indexOf(txt.toLowerCase()) >= 0;
      if (blnFlg) {
        newDisplayArr.push(displayArr[i])
        newDBArr.push(dbArr[i])
        newExpanded.push(false)
      }
    }
    if (txt == '') {
      newDisplayArr = displayArr;
      newDBArr = dbArr;
    }

    this.setState({ filteredDisplayArr: newDisplayArr, filteredDBArr: newDBArr, expandedPanels: newExpanded})
  }

  render() {
    return (
      <div>
        <NavBar />
        <Box marginTop = "90px"></Box>
        <RenderSearchBar fnInput={this.handleInputChange} inputTxt={this.state.search} arr={this.state.resultsDisplay} fnSearch={this.handleSearchOnClick} />
        <SimpleExpansionPanel dbList={this.state.filteredDBArr} displayList={this.state.filteredDisplayArr} expandedPanels={this.state.expandedPanels} parentCallback1={this.searchCallbackFunction}/>
      </div>
    )
  }
}

//will print out all the expansion panels
function SimpleExpansionPanel(props) {
  const classes = useStyles();

  let assetDisplayNames = props.displayList
  let assetDBNames = props.dbList;

  const callbackFunction = (childData, index) => {
    props.parentCallback1(childData, index)
  }

  let foundAssets = []
  //loops through each asset and makes an expansion panel for each one
  for (let i = 0; i < assetDBNames.length; i++) {
    foundAssets.push(<AssetDescriptionPanel assetDisplayName={assetDisplayNames[i]} assetDBName={assetDBNames[i]} expandedPanel={props.expandedPanels[i]} parentCallback={callbackFunction} index={i}/>)
  }

  return (
    <div className={classes.root} style={{ marginTop: 30 }}>
      {foundAssets}
    </div>
  );
}

//renders the search bar and the Search btn
function RenderSearchBar(props) {
  const classes = useStyles();

  return (
    <Grid container justify='center' align='center' direction='row' style={{ marginTop: '30px', marginLeft: '30px', justify: 'center' }}>
      <br />
      <Grid item>

        <InputBase className={classes.search}
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={props.fnInput}
          onKeyPress={event => { if (event.key === 'Enter') { props.fnSearch() } }}
        />

      </Grid>

      <Button variant="contained" color='default' size='small' onClick={() => props.fnSearch()}>
        <SearchIcon></SearchIcon>
      </Button>
    </Grid>
  )
}

