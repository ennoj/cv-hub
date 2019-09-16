import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

import Spinner from '../layout/Spinner';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2),
    backgroundColor: '#212121',
    color: '#f5f5f5'
  },
  link: {
    color: '#f5f5f5',
    textDecoration: 'none'
  }
}));

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  const classes = useStyles();

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Typography variant='h4'>Ohjauspaneeli</Typography>
      <br />
      <Typography variant='h6'>Tervetuloa, {user && user.name}</Typography>

      {profile !== null ? (
        <Fragment>lol</Fragment>
      ) : (
        <Fragment>
          <Typography variant='subtitle1'>
            Sinulla ei ole vielä profiilia.
          </Typography>
          <Button className={classes.button} color='inherit'>
            <Link className={classes.link} to='/create-profile'>
              Luo profiili
            </Link>
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
