import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';

import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(edu => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td>{edu.degree}</td>
      <td>
        <Moment format='DD.MM.YYYY'>{edu.from}</Moment> -{' '}
        {edu.to === null ? (
          ' Nyt'
        ) : (
          <Moment format='DD.MM.YYYY'>{edu.to}</Moment>
        )}
      </td>
      <td>
        <button onClick={() => deleteEducation(edu._id)}>Poista</button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2>Koulutus</h2>
      <table>
        <thead>
          <tr>
            <th>Oppilaitos</th>
            <th>Tutkinto</th>
            <th>Vuodet</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEducation }
)(Education);
