import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SnackbarContent from '@material-ui/core/SnackbarContent';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <SnackbarContent
      style={{ margin: '20px' }}
      key={alert.id}
      message={alert.msg}
    />
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);

/*
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
*/
