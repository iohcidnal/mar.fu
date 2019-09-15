import React from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';

export default function NavigationLoader(props) {
  React.useEffect(
    () => {
      beginNavigation();

      async function beginNavigation() {
        const userToken = await AsyncStorage.getItem('user-token');
        props.navigation.navigate(userToken ? 'MedicationGroups' : 'MedicationGroups');
      }
    },
    [props.navigation]
  );

  return null;
}

NavigationLoader.propTypes = {
  navigation: PropTypes.object.isRequired,
};
