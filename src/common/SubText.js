import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'native-base';

export default function SubText({ text }) {
  return (
    <Text style={{ color: 'gray' }}>{text}</Text>
  );
}

SubText.propTypes = {
  text: PropTypes.string.isRequired
};
