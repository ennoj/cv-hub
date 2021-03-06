import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  logButton: {
    marginRight: theme.spacing(2)
  },
  link: {
    color: '#f5f5f5',
    textDecoration: 'none'
  },
  title: {
    flexGrow: 1
  }
}));

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const classes = useStyles();

  const authLinks = (
    <Fragment>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/profiles'>
          Käyttäjät
        </Link>
      </Button>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/dashboard'>
          Ohjauspaneeli
        </Link>
      </Button>
      <Button className={classes.logButton} color='inherit'>
        <Link onClick={logout} className={classes.link} to='#!'>
          Kirjaudu Ulos
        </Link>
      </Button>
    </Fragment>
  );
  const guestLinks = (
    <Fragment>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/profiles'>
          Käyttäjät
        </Link>
      </Button>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/register'>
          Rekisteröidy
        </Link>
      </Button>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/login'>
          Kirjaudu Sisään
        </Link>
      </Button>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            <Link className={classes.link} to='/'>
              verkkoCV
            </Link>
          </Typography>
          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
