import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2),
    backgroundColor: '#212121',
    color: '#f5f5f5'
  }
}));

const Login = ({ login, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    login(email, password);
  };

  // Uudelleenohjaa jos käyttäjä on kirjautunut sisään
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Grid
      container
      direction='column'
      justify='flex-start'
      alignItems='flex-start'
    >
      <Box>
        <Typography variant='h4'>Kirjaudu Sisään!</Typography>
        <form onSubmit={e => onSubmit(e)}>
          <TextField
            name='email'
            value={email}
            onChange={e => onChange(e)}
            label='Sähköposti'
            placeholder='esi.merkki@gmail.com'
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='password'
            value={password}
            onChange={e => onChange(e)}
            label='Salasana'
            placeholder='Vähintään KUUSI merkkiä pitkä'
            fullWidth
            type='password'
            autoComplete='current-password'
            margin='normal'
            required
          />

          <br />
          <br />
          <Button
            type='submit'
            value='Login'
            className={classes.button}
            color='inherit'
          >
            Kirjaudu
          </Button>
        </form>

        <Typography variant='subtitle2'>
          Eikö sinulla ole vielä tiliä?{' '}
          <Link className={classes.link} to='/register'>
            Rekisteröidy
          </Link>
          .
        </Typography>
      </Box>
    </Grid>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
