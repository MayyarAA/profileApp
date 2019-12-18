import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import Popover from '@material-ui/core/Popover';
import UILink from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { HashRouter as Router, Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  typography: {
    padding: theme.spacing(2),

  },
  navLink: {
    textDecoration: 'none',
    color: '#FFF',
    marginLeft: '20px'
  },
  paper: {
    padding: theme.spacing(1),
  },
  leftElements: {
    textDecoration: 'none',
    color: '#FFF',
    marginLeft: '20px',
    marginLeft: 'auto'
  },
  loadingCircle: 'flex',
  '& > * + *': {
    marginLeft: theme.spacing(2),
  },

}));

function Helper(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showSaveGraphic, setShowSaveGraphic] = React.useState(false);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  //Grab the url of the current page 
  let url = window.location.href;
  //take the last 5 chars from the url and if it is '/view' 
  if (url.substr(url.length - 10) == '/mapskills' && showSaveGraphic == false) {
    setShowSaveGraphic(true);
  }
  else if (showSaveGraphic == true && url.substr(url.length - 10) != '/mapskills') {
    setShowSaveGraphic(false);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" style={{ background: "#00009A" }}>
        <Toolbar>
          <Link to="/mapskills" className={classes.navLink} align='left'>
            <Box textAlign="left" style={{ fontFamily: "Manulife JH Sans" }}>
              <Typography variant="h6" flex={1} align='left' fontFamily="Manulife JH Sans">
                Asset Skills Mapper
        </Typography>
            </Box>
          </Link>

          <Link to="/mapskills" className={classes.navLink}>
            <Button color="inherit" align='left' style={{ fontFamily: "Manulife JH Sans" }}>Map Skills</Button>
          </Link>

          <Link to="/search" className={classes.navLink}>
            <Button color="inherit" align='left' style={{ fontFamily: "Manulife JH Sans" }} >Search</Button>
          </Link>

          <Link to="/login" className={classes.leftElements} >
            <Button color="inherit" style={{ fontFamily: "Manulife JH Sans" }} >Logout</Button>
          </Link>

          <Button onClick={handleClick} color='inherit' >
            <HelpIcon />
          </Button>

          {showSaveGraphic &&
            <div className={classes.loadingCircle}>
              {/* <CircularProgress color="secondary" size = {30}/> */}
            </div>
          }
          {showSaveGraphic &&
            <Typography className={classes.typography} >
              {props.changingTxt}
            </Typography>
          }
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className={classes.paper}>
              <UILink href="mailto:GB_Transformation@manulife.com" style={{ borderRadius: 5 }}>
                Need Help? Contact GB_Transformation@manulife.com
              </UILink>
            </div>
          </Popover>
        </Toolbar>
      </AppBar>
    </div>
  );
}

class NavBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      saveTxt: ''
    }
  }
  componentDidMount() {
    let txt = 0;
    this.timeout = setInterval(() => {
      txt++;
      console.log(txt)
      if (txt % 2 === 0) {
        this.setState({ saveTxt: 'Saved.' });
      }
      else {
        this.setState({ saveTxt: 'Autosaving...' });
      }
    }, 5000)
  }
  componentWillUnmount() {
    clearInterval(this.timeout)
  }
  render() {
    return (
      <div>
        <Helper changingTxt={this.state.saveTxt} />
      </div>
    );
  }
}

export { NavBar };