import React, { Component } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Box from '@material-ui/core/Box'
import Rating from '@material-ui/lab/Rating';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link'
const axios = require('axios').default;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const SquadsTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(8)
  },
}))(Tooltip);

export default function AssetDescriptionPanel(props) {
  const classes = useStyles();
  const [skillsList, setSkillsList] = React.useState(Object());

  let grid = EmployeeSkillsData(skillsList);

  const handleChange = asset => (event, isExpanded) => {
      props.parentCallback(isExpanded, props.index)
      if(isExpanded == true) {
          let path = 'http://localhost:5000/api/search/asset/' + props.assetDBName.replace("/", "~")

          axios.post(path, {})
          .then(async function (response) {

            let skills = Object();
            if(response.data.employeeIds.length > 0) {
              skills.isData = true;
              skills.manulifeIds = response.data.employeeIds;
              skills.techRatings = response.data.employeeTechRatings;
              skills.busRatings = response.data.employeeBusRatings;
              skills.recencies = response.data.employeeRecencies;
              skills.names = [];
              skills.emails = [];
              skills.streams = [];
              skills.squads = [];

              for(let i=0; i<skills.manulifeIds.length; i++) {
                let idPath = 'http://localhost:5000/api/search/employee/' + skills.manulifeIds[i]

                await axios.post(idPath, {})
                .then(function (response) {
                  skills.names.push(response.data.employeeName)
                  skills.emails.push(response.data.employeeEmail)
                  skills.streams.push(response.data.employeeStream)
                  
                  let squads = response.data.employeeSquads;
                  let squadsFormatted = squads[0];
                  let squadElement;
                  
                  if(squads.length > 1) {
                    squadsFormatted += '...'

                    let squadTooltip = "";
                    for(let j=0; j<squads.length; j++) {
                      squadTooltip += squads[j];

                      if(j !== squads.length - 1) {
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

                  skills.squads.push(squadElement)
                })
                .catch(function (error) {
                  //console.log(error);
                })
              }
            } else {
              skills.isData = false;
            }

            setSkillsList(skills);
          })
          .catch(function (error) {
              //console.log(error);
          });
      }
  };    

  return (
    <div className={classes.root}>       
      <ExpansionPanel expanded={props.expandedPanel} style={{marginTop: '30px', marginRight: '40px', marginLeft: '40px',  
          borderRadius: '10px'}} onChange={handleChange('sdfsf')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ backgroundColor: '#C1D8F7',  borderRadius: '10px'}} >
          <Typography className={classes.heading}>
              {props.assetDisplayName}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{borderRadius: '10px'}}>
          <ExpansionGrid gridList={grid} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

function ExpansionGrid(props) {
  if(props.gridList == null) {
    return null;
  } else if(props.gridList.length === 1) {
    return (props.gridList);
  }

  return (
    <GridList cols={7} style={{overflow: 'hidden', marginTop: '16px', marginLeft: '-40px'}}>
      {props.gridList.map((column, index) => (
        <GridListTile key={index} cols={1} style={{marginBottom: '-130px', padding: '-5px'}}>
          {props.gridList[index]}
        </GridListTile>
      ))}
    </GridList>
  )
}

function EmployeeSkillsData(skills) {

  let grid = [];
  if(skills.isData == null) {
    return null;
  } else if(skills.isData === false) {
    grid.push(<Box fontFamily='Manulife JH Sans'>There are no people associated with this asset yet.</Box>)
    return grid;
  }

  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14}>Name</Box>)
  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14} style={{marginLeft: -30}}>Technical Skills</Box>)
  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14} style={{marginLeft: -30}}>Business Knowledge</Box>)
  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14} style={{marginLeft: -30}}>Recency</Box>)
  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14} style={{marginLeft: -30}}>Email</Box>)
  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14}>Stream</Box>)
  grid.push(<Box fontFamily="Manulife JH Sans" fontWeight="fontWeightBold" fontSize={14}>Squads</Box>)

  let techStars, busStars, recStars, link;
  for(let i=0; i<skills.manulifeIds.length; i++) {
    techStars = "Stars" + (i*7 + 1);
    busStars = "Stars" + (i*7 + 2);
    recStars = "Stars" + (i*7 + 3);
    link = "mailto:" + skills.emails[i]

    grid.push(<Box fontFamily="Manulife JH Sans" fontSize={14}>{skills.names[i]}</Box>)
    grid.push(<Box><Rating name={techStars} value={skills.techRatings[i]} readOnly max={3} style={{marginLeft: -30}}/></Box>)
    grid.push(<Box><Rating name={busStars} value={skills.busRatings[i]} readOnly max={3} style={{marginLeft: -30}} /></Box>)
    grid.push(<Box><Rating name={recStars} value={skills.recencies[i]} readOnly max={4} style={{marginLeft: -30}} /></Box>)
    grid.push(<Link href={link} style={{fontFamily: "Manulife JH Sans", fontSize: "14px"}}>{skills.emails[i]}</Link>)
    grid.push(<Box fontFamily="Manulife JH Sans" fontSize={14}>{skills.streams[i]}</Box>)
    grid.push(skills.squads[i])
  }

  return grid;
}

