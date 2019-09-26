import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
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

const DashboardActions = () => {
  const classes = useStyles();

  return (
    <div>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/edit-profile'>
          Muokkaa profiilia
        </Link>
      </Button>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/add-experience'>
          Lisää työkokemus
        </Link>
      </Button>
      <Button className={classes.logButton} color='inherit'>
        <Link className={classes.link} to='/add-education'>
          Lisää koulutus
        </Link>
      </Button>
    </div>
  );
};

export default DashboardActions;
