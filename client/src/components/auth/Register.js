import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

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

const Register = ({ setAlert, register, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Salasanat eivät täsmää', 'danger');
    } else {
      register({ name, email, password });
    }
  };

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
        <Typography variant='h4'>Rekisteröidy!</Typography>
        <form onSubmit={e => onSubmit(e)}>
          <TextField
            name='name'
            value={name}
            onChange={e => onChange(e)}
            label='Nimi'
            placeholder='Esi Merkki'
            fullWidth
            margin='normal'
            required
          />
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
            minLength='6'
          />
          <br />
          <TextField
            name='password2'
            value={password2}
            onChange={e => onChange(e)}
            label='Salasana uudestaan'
            fullWidth
            type='password'
            autoComplete='current-password'
            margin='normal'
            minLength='6'
          />
          <br />
          <br />
          <Button
            type='submit'
            value='Register'
            className={classes.button}
            color='inherit'
          >
            Rekisteröidy
          </Button>
        </form>

        <Typography variant='subtitle2'>
          Onko sinulla jo tili?{' '}
          <Link className={classes.link} to='/login'>
            Kirjaudu sisään
          </Link>
          .
        </Typography>
      </Box>
    </Grid>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// connectin sulkuihin: 1: statet jotka haluat mapata. 2: objekti jonka actioneita haluat käyttää
export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
