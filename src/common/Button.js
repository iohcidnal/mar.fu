import React from 'react';
import PropTypes from 'prop-types';
import { Button as NbButton, Spinner, Text } from 'native-base';

export default function Button({ label, isSubmitting = false, ...props }) {
  const labelUpperCase = label.toUpperCase();
  return (
    <NbButton
      block
      bordered
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting && <Spinner color="gray" />}
      <Text>{!isSubmitting ? labelUpperCase : 'Submitting...'}</Text>
    </NbButton>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
};
