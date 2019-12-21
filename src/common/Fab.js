import React from 'react';
import PropTypes from 'prop-types';
import { Fab as FabNativeBase, Icon, Button } from 'native-base';

import { auth } from '../db';

export default function Fab({ navigation, onAdd }) {
  const [isActive, setIsActive] = React.useState(false);

  const handleLogOut = async () => {
    await auth.signOut();
    navigation.navigate('Login');
  };

  return (
    <FabNativeBase
      style={{ backgroundColor: '#5067FF' }}
      active={isActive}
      onPress={() => setIsActive(value => !value)}
    >
      <Icon name="more" />
      <Button style={{ backgroundColor: '#34A34F' }} onPress={() => onAdd()}>
        <Icon name="add" />
      </Button>
      <Button style={{ backgroundColor: '#DD5144' }} onPress={() => handleLogOut()}>
        <Icon name="log-out" />
      </Button>
    </FabNativeBase>
  );
}

Fab.propTypes = {
  navigation: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired
};
