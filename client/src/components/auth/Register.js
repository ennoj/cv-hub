import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2),
    backgroundColor: '#212121',
    color: '#f5f5f5'
  }
}));

const Register = () => {
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

  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Salasanat eivät täsmää');
    } else {
      console.log(formData);
    }
  };

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
            required
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
            required
          />
          <br />
          <br />
          <Button type='submit' className={classes.button} color='inherit'>
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

export default Register;
