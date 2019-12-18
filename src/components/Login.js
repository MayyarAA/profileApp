import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid'; 
import Typography from '@material-ui/core/Typography';
const axios = require('axios').default

//globalId holds the user's manulifeEmail - will be sent to the viewpagefor other axios calls                                   
let globalId ;

export  class Login extends Component {
    constructor(props){
        super(props);
        this.backendLog = this.backendLog.bind(this);
        this.responseHolder = this.responseHolder.bind(this);
        this.checkEmailValid = this.checkEmailValid.bind(this);

        this.state = {
            manulifeEmail: '',
            manulifeIdLoc: '',
            axiosHolder: '',
            axiosIdHolder: '',
            manulifeEmailValid: '',
            errorMessage: ''
        };
    }

    //setting the globalId var equal he user input
    async backendLog() {
        globalId = this.state.manulifeEmail;
    }

    responseHolder(test) {
        this.setState({ axiosHolder: test })
    }

    //checks if the manulife email is valid if not returns error message
    //compares the manulife email entered to the axios call with the same manulife email entered by user
    async checkEmailValid() {
        globalId = this.state.manulifeEmail;

        let path = 'http://localhost:5000/api/login/' + this.state.manulifeEmail
        let resEmail;

        await axios.post(path, {})
        .then(async function (response) {
            resEmail = response.data.manulifeIdtwo;
        })
        .catch(function (error) {
            //console.log(error);
        });

        this.setState({ manulifeEmailValid: resEmail })

        if(this.state.manulifeEmailValid) {
            this.props.history.push('/mapskills')
        }
        else {
            this.setState({ errorMessage: 'Email is invalid.'});
            //console.log(this.state.errorMessage);
        }
    }

    render(){
        let holder = 
            <div>
                <Grid container fontFamily="Manulife JH Sans" spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }} > 
                    <Grid item padding={10} >
                        <Box fontFamily="Manulife JH Sans" >
                            <Typography variant="h3" align='left' style={{marginBottom: '30px'}} fontFamily="Manulife JH Sans" >Asset Skills Mapper</Typography>
                        </Box>
                    </Grid>

                    <Grid item padding={10}>
                        <TextField width ={400} autoFocus
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.checkEmailValid();
                                }
                            }}
                            variant="outlined"
                            label="Manulife Email"
                            style={{minWidth: '400px'}}
                            onChange = { e=> this.setState({manulifeEmail: e.target.value})}
                            value = {this.state.manulifeEmail}
                        /> 
                    </Grid>
                    <Grid item >
                        <Button variant="contained" color="primary" style={{marginTop: '30px', minWidth: '400px'}} width={400} height={35} onClick={this.checkEmailValid}>Login</Button>
                        <Box marginTop='10px'>
                            {this.state.errorMessage}
                        </Box>
                    </Grid>
                </Grid>
             </div>;

        let test2 = <div><Box>{this.state.manulifeIdLoc}</Box></div>;

        return(
            <div> 
                {holder}
                {test2}
            </div>
        )
    }
}

//exporting the valid manulife email the user entered
export {globalId}