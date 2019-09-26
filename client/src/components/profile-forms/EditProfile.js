import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../actions/profile';

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
  },
  link: {
    color: '#f5f5f5',
    textDecoration: 'none'
  }
}));

const EditProfile = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState({
    company: '',
    website: '',
    location: '',
    status: '',
    skills: '',
    githubusername: '',
    bio: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    instagram: ''
  });

  useEffect(() => {
    getCurrentProfile();

    setFormData({
      company: loading || !profile.company ? '' : profile.company,
      website: loading || !profile.website ? '' : profile.website,
      location: loading || !profile.location ? '' : profile.location,
      status: loading || !profile.status ? '' : profile.status,
      skills: loading || !profile.skills ? '' : profile.skills.join(','),
      githubusername:
        loading || !profile.githubusername ? '' : profile.githubusername,
      bio: loading || !profile.bio ? '' : profile.bio,
      twitter: loading || !profile.social ? '' : profile.social.twitter,
      facebook: loading || !profile.social ? '' : profile.social.facebook,
      linkedin: loading || !profile.social ? '' : profile.social.linkedin,
      youtube: loading || !profile.social ? '' : profile.social.youtube,
      instagram: loading || !profile.social ? '' : profile.social.instagram
    });
  }, [loading, getCurrentProfile]);

  const {
    company,
    website,
    location,
    status,
    skills,
    githubusername,
    bio,
    twitter,
    facebook,
    linkedin,
    youtube,
    instagram
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  };

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
        <form onSubmit={e => onSubmit(e)}>
          <TextField
            name='status'
            value={status}
            onChange={e => onChange(e)}
            label='Nykyinen työ'
            placeholder='Ohjelmistosuunnittelija'
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='company'
            value={company}
            onChange={e => onChange(e)}
            label='Työnantaja'
            placeholder='Google'
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='website'
            value={website}
            onChange={e => onChange(e)}
            label='Henkilökohtainen kotisivu'
            placeholder='Google'
            fullWidth
            margin='normal'
          />
          <TextField
            name='location'
            value={location}
            onChange={e => onChange(e)}
            label='Paikkakunta'
            placeholder='Helsinki'
            fullWidth
            margin='normal'
            required
          />
          <br />
          <TextField
            name='skills'
            value={skills}
            onChange={e => onChange(e)}
            label='Osaamisesi'
            placeholder='React, Angular, Node'
            fullWidth
            margin='normal'
            required
          />
          <TextField
            name='githubusername'
            value={githubusername}
            onChange={e => onChange(e)}
            label='Github-käyttäjänimesi'
            placeholder='Github-käyttäjänimesi (ohjelmoijille)'
            fullWidth
            margin='normal'
          />
          <TextField
            name='bio'
            value={bio}
            onChange={e => onChange(e)}
            label='Lyhyt kuvaus'
            placeholder='Muutaman lauseen kuvaus itsestäsi'
            fullWidth
            margin='normal'
            required
          />
          <br />
          <br />
          <TextField
            name='facebook'
            value={facebook}
            onChange={e => onChange(e)}
            label='Facebook'
            placeholder='Linkki Facebook-profiiliin'
            fullWidth
            margin='normal'
          />
          <TextField
            name='linkedin'
            value={linkedin}
            onChange={e => onChange(e)}
            label='LinkedIn'
            placeholder='Linkki LinkedIn-profiiliin'
            fullWidth
            margin='normal'
          />
          <TextField
            name='youtube'
            value={youtube}
            onChange={e => onChange(e)}
            label='YouTube'
            placeholder='Linkki YouTube-profiiliin'
            fullWidth
            margin='normal'
          />
          <TextField
            name='twitter'
            value={twitter}
            onChange={e => onChange(e)}
            label='Twitter'
            placeholder='Linkki Twitter-profiiliin'
            fullWidth
            margin='normal'
          />
          <TextField
            name='instagram'
            value={instagram}
            onChange={e => onChange(e)}
            label='Instagram'
            placeholder='Linkki Instagram-profiiliin'
            fullWidth
            margin='normal'
          />
          <br />
          <br />
          <Button
            type='submit'
            value='Tallenna'
            className={classes.button}
            color='inherit'
          >
            Tallenna
          </Button>
          <Button className={classes.button} color='inherit'>
            <Link className={classes.link} to='/dashboard'>
              Takaisin
            </Link>
          </Button>
        </form>
      </Box>
    </Grid>
  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(EditProfile));
