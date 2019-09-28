import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills
  }
}) => {
  return (
    <div>
      <img src={avatar} alt='avatar' />
      <div>
        <h2>{name}</h2>
        <p>
          {status}
          {company && <span>, yrityksessä {company}</span>}
        </p>
        <p>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`}>Profiili</Link>
      </div>

      <ul>
        {skills.slice(0, 5).map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <br />
      <br />
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
