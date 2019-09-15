import React from 'react';

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

  return (
    <Grid
      container
      direction='column'
      justify='flex-start'
      alignItems='flex-start'
    >
      <Box>
        <Typography variant='h4'>Rekisteröidy!</Typography>
        <TextField
          id='name'
          label='Nimi'
          placeholder='Esi Merkki'
          fullWidth
          margin='normal'
        />
        <TextField
          id='email'
          label='Sähköposti'
          placeholder='esi.merkki@gmail.com'
          fullWidth
          margin='normal'
        />
        <TextField
          id='password'
          label='Salasana'
          placeholder='Minimissään KUUSI merkkiä pitkä'
          fullWidth
          type='password'
          autoComplete='current-password'
          margin='normal'
        />
        <br />
        <TextField
          id='password2'
          label='Salasana uudestaan'
          fullWidth
          type='password'
          autoComplete='current-password'
          margin='normal'
        />
        <br />
        <br />
        <Button className={classes.button} color='inherit'>
          Rekisteröidy
        </Button>
      </Box>
    </Grid>
  );
};

export default Register;
