import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  error: {
    color: 'red',
    fontSize: 12
  },
  default: {}
});

export default function HelpText({ message, type = 'error' }) {
  if (!message) return null;
  return <Text style={styles[type]}>{message}</Text>;
}

HelpText.propTypes = {
  /** Message to be displayed. */
  message: PropTypes.string,
  /** Type of help. */
  type: PropTypes.oneOf(['default', 'error']),
};
