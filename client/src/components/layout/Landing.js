import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  container: {
    minHeight: '95vh'
  },
  logButton: {
    marginRight: theme.spacing(2),
    backgroundColor: '#212121',
    color: '#f5f5f5'
  },
  link: {
    color: '#f5f5f5',
    textDecoration: 'none'
  }
}));

const Landing = ({ isAuthenticated }) => {
  const classes = useStyles();

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Grid
      className={classes.container}
      container
      direction='column'
      justify='center'
      alignItems='center'
    >
      <Box>
        <Grid item xs align='center'>
          <Typography variant='h4'>Tervetuloa verkkoCV-palveluun</Typography>
          <Typography variant='h6'>
            Luo oma CV - voit linkittää sen helposti tai tarvittaessa tulostaa.
          </Typography>
        </Grid>

        <Grid item xs align='center'>
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
        </Grid>
      </Box>
    </Grid>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
