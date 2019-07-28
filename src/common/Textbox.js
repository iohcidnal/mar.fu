import React from 'react';
import { Icon, Item, Input } from 'native-base';
import PropTypes from 'prop-types';

import HelpText from './HelpText';

export default function Textbox({ iconName, iconType = 'Ionicons', errorMessage, ...props }) {
  return (
    <Item error={!!errorMessage}>
      {iconName &&
        <Icon
          active name={iconName}
          type={iconType}
        />
      }
      <Input {...props} />
      {errorMessage && <HelpText message={errorMessage} />}
    </Item>
  );
}

Textbox.propTypes = {
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  errorMessage: PropTypes.string
};
