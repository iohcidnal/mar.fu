import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Fab as FabNativeBase, Icon, Button } from 'native-base';
import { withNavigation } from 'react-navigation';

import { auth } from '../db';

const fabBgColor = Platform.OS === 'ios' ? '#007AFF' : '#4855B8';

function Fab({ navigation, shouldShowAdd = true, onAdd }) {
  const [isActive, setIsActive] = React.useState(false);

  const handleLogOut = async () => {
    await auth.signOut();
    navigation.navigate('Login');
  };

  return (
    <FabNativeBase
      style={{ backgroundColor: fabBgColor }}
      active={isActive}
      onPress={() => setIsActive(value => !value)}
    >
      <Icon name="more" />
      {shouldShowAdd &&
        <Button style={{ backgroundColor: '#34A34F' }} onPress={() => onAdd()}>
          <Icon name="add" />
        </Button>
      }
      <Button style={{ backgroundColor: '#DD5144' }} onPress={() => handleLogOut()}>
        <Icon name="log-out" />
      </Button>
    </FabNativeBase>
  );
}

Fab.propTypes = {
  navigation: PropTypes.object.isRequired,
  shouldShowAdd: PropTypes.bool,
  onAdd: PropTypes.func
};

export default withNavigation(Fab);
