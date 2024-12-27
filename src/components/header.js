import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import github_mark from '../images/github_mark.png';
import TableCount from './tableCount';

class Header extends Component {

    render() {

        const { rowCountProp } = this.props;

        return (
            <div id="header">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" id="logo">
                        <img class="emoji" draggable="false" alt="☕" src="./favicon.png"> MAPA FOME <span className="beta">(beta) site:</span> www.mapafome.com.br - assista aqui <a target='_blank' rel="noreferrer" style={{"color":"red"}} href="https://www.youtube.com/watch?v=JcP9v5mZT9w">Ilha das Flores</a>
                        </Typography>
                        {/* <TableCount rowCountProp={rowCountProp} /> */}
                        {/* <a href="https://docs.google.com/spreadsheets/d/1u7jiqY1qM0jYWugn1dFiW3plQrvWysJqm8xXhO35zuU/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                            <Button
                                variant="contained"
                                size="small">
                                Add<span id="RoasterButtonMobile">&nbsp;Roaster</span>
                            </Button>
                        </a>
                        <a href="https://github.com/hdehal/coffee-maps" target="_blank" rel="noopener noreferrer">
                            <IconButton
                                className="GitHub"
                                variant="outlined"
                                size="small">
                                <img className="GitHub" src={github_mark} alt="Hosted on GitHub" />
                            </IconButton>
                        </a> */}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Header;
