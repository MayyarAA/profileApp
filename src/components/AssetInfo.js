import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { NavBar } from './NavBar';
import Rating from '@material-ui/lab/Rating';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link'
const axios = require('axios').default

const SquadsTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(8)
  },
}))(Tooltip);


export default class Asset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeBusRatings: [],
      employeeIds: [],
      employeeRecencies: [],
      employeeTechRatings: [],
      names: [],
      emails: [],
      streams: [],
      squads: [],
      assetIdentification: '',
      assetDescription: '',
      grid: []
    }

    this.getAssetInfo = this.getAssetInfo.bind(this);
  }

  componentDidMount() {
    this.getAssetInfo();
  }

  async getAssetInfo() {
    let str = this.props.location.pathname;
    let assetParsedName = str.replace("/assetInfo/", "")
    let tilda = assetParsedName.replace("/", "~")

    let path = 'http://localhost:5000/api/assetInfo/' + tilda;
    let resEmpIds = [], resBusRate = [], resRecenies = [], resTechRate = [], resName = [], resEmail = [], resStream = [], resSquads = [];
    let resAssetId, resAssetDesc;

    await axios.post(path, {})
    .then(async function (response) {
      resAssetId = response.data.assetIdentification;
      resAssetDesc = response.data.assetDescription;
      if (response.data.employeeIds.length > 0) {
        resEmpIds = response.data.employeeIds;
        resBusRate = response.data.employeeBusRatings;
        resRecenies = response.data.employeeRecencies;
        resTechRate = response.data.employeeTechRatings;

        for (let i = 0; i < resEmpIds.length; i++) {

          let idPath = 'http://localhost:5000/api/assetInfo/employee/' + resEmpIds[i];
          await axios.post(idPath, {})
          .then(function (response) {
            resName.push(response.data.employeeName);
            resEmail.push(response.data.employeeEmail);
            resStream.push(response.data.employeeStream);

            let squads = response.data.employeeSquads;
            let squadsFormatted = squads[0];
            let squadElement;

            if (squads.length > 1) {
              squadsFormatted += '...'

              let squadTooltip = "";
              for (let j = 0; j < squads.length; j++) {
                squadTooltip += squads[j];

                if (j !== squads.length - 1) {
                  squadTooltip += ', '
                }
              }

              squadElement =
                <SquadsTooltip title={
                  <React.Fragment>
                    <Typography color="inherit" style={{ fontFamily: "Manulife JH Sans" }}>{squadTooltip}</Typography>
                  </React.Fragment>} >
                  <Box fontFamily="Manulife JH Sans" fontSize={14}>{squadsFormatted}</Box>
                </SquadsTooltip>
            }
            else {
              squadElement = <Box fontFamily="Manulife JH Sans" fontSize={14}>{squads[0]}</Box>;
            }

            resSquads.push(squadElement)
          })
          .catch(function (error) {
            // console.log(error);
          })
        }
      }

    })
    .catch(function (error) {
      // console.log(error);
    });

    this.setState({
      employeeIds: resEmpIds, employeeBusRatings: resBusRate, employeeRecencies: resRecenies, employeeTechRatings: resTechRate, names: resName, emails: resEmail,
      streams: resStream, squads: resSquads, assetIdentification: assetParsedName, assetDescription: resAssetDesc
    });

    let tmp = EmployeeSkillsData(this.state.employeeIds, this.state.employeeTechRatings, this.state.employeeBusRatings, this.state.employeeRecencies, this.state.names, this.state.emails, this.state.streams, this.state.squads)
    this.setState({ grid: tmp })
  }

  render() {

    let peopleAssociated;
    if (this.state.employeeIds.length > 1) {
      peopleAssociated =
        <Grid container direction="row" justify="center" alignItems="center">
          <GridList cols={7} style={{ overflow: 'hidden', marginTop: '10px', marginLeft: '-40px' }}>
            {this.state.grid.map((column, index) => (
              <GridListTile key={index} cols={1} style={{ marginBottom: '-130px', padding: '-3px' }}>
                {this.state.grid[index]}
              </GridListTile>
            ))}
          </GridList>
        </Grid>
    }
    else {
      peopleAssociated = <Box fontFamily='Manulife JH Sans' fontSize={18}>There are no people associated with this asset yet.</Box>
    }

    console.log(this.state.assetIdentification)
    return (
      <div>
        <NavBar />

        <Box fontSize={25} fontWeight="fontWeightBold" fontFamily="Manulife JH Sans" marginTop="40px" marginBottom="20px">
          {this.state.assetIdentification}
        </Box>
        <Grid container justify="center" alignItems="center">
          <Box fontSize={18} fontFamily="Manulife JH Sans" marginTop="40px" marginBottom="20px" width="50%">
            {this.state.assetDescription}
          </Box>
        </Grid>

        <Box fontSize={25} fontWeight="fontWeightBold" fontFamily="Manulife JH Sans" marginTop="60px" marginBottom="34px">
          People Associated
        </Box>
        {peopleAssociated}
      </div>
    )
  }
}

function EmployeeSkillsData(employeeIds, employeeTechRatings, employeeBusRatings, employeeRecencies, names, emails, streams, squads) {

  let grid = [];
  if (employeeIds.length > 1) {
    const panelHeadings = ['Name', 'Technical Skills', 'Business Knowledge', 'Recency', 'Email', 'Stream', 'Squads']

    for (let j = 0; j < panelHeadings.length; j++) {
      grid.push(<Box fontWeight="fontWeightBold" fontFamily="Manulife JH Sans" fontSize={14}>{panelHeadings[j]}</Box>)
    }

    let techStars, busStars, recStars, link;
    for (let i = 0; i < employeeIds.length; i++) {
      techStars = "Stars" + (i * 7 + 1);
      busStars = "Stars" + (i * 7 + 2);
      recStars = "Stars" + (i * 7 + 3);
      link = "mailto:" + emails[i]

      grid.push(<Box fontFamily="Manulife JH Sans" fontSize={14}>{names[i]}</Box>)
      grid.push(<Box><Rating name={techStars} value={employeeTechRatings[i]} readOnly max={3} /></Box>)
      grid.push(<Box><Rating name={busStars} value={employeeBusRatings[i]} readOnly max={3} /></Box>)
      grid.push(<Box><Rating name={recStars} value={employeeRecencies[i]} readOnly max={4} /></Box>)
      grid.push(<Link href={link} style={{ fontFamily: "Manulife JH Sans", fontSize: "14px" }}>{emails[i]}</Link>)
      grid.push(<Box fontFamily="Manulife JH Sans" fontSize={14}>{streams[i]}</Box>)
      grid.push(<Box fontFamily="Manulife JH Sans" fontSize={14}>{squads[i]}</Box>)
    }
  }

  return grid;
}