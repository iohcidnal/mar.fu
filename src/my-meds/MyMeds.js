import React from 'react';
import PropTypes from 'prop-types';
import { Container, Fab, Icon } from 'native-base';

import { Banner } from '../common';

export default function MyMeds({ navigation }) {
  function handleAdd() {
    navigation.navigate('NewRecordForm');
  }

  return (
    <Container>
      <Banner title="My Meds" />
      <Fab onPress={handleAdd}>
        <Icon name="add" />
      </Fab>
    </Container>
  );
}

MyMeds.navigationOptions = () => ({
  title: 'My Meds'
});

MyMeds.propTypes = {
  navigation: PropTypes.object.isRequired
};
