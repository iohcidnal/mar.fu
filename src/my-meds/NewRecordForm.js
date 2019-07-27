import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Icon, Form, Item, Input } from 'native-base';

import { Banner, Button, useHandleChangeText, useSubmit } from '../common';
import { auth, db } from '../db';

const initialState = {
  name: '',
  description: ''
};

export default function NewRecordForm({ navigation }) {
  const [state, handleChangeText] = useHandleChangeText(initialState);
  const [isSubmitting, handleSubmit] = useSubmit(createNewRecord, 'New record created successfully.');

  async function createNewRecord() {
    const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user
    await db
      .collection('my-meds')
      .doc(userUid)
      .set(
        {
          uid: userUid,
          name: state.name,
          description: state.description,
        },
        { merge: true }
      );
    navigation.navigate('MyMeds');
  }

  return (
    <Container>
      <Banner title="New Record" iconName="folder" />
      <Form>
        <Item>
          <Icon active name="folder" />
          <Input
            placeholder="Name"
            autoCapitalize="words"
            value={state.name}
            onChangeText={text => handleChangeText('name', text)}
          />
        </Item>
        <Item fixedLabel>
          <Icon active type="MaterialIcons" name="description" />
          <Input
            placeholder="Description"
            value={state.description}
            onChangeText={text => handleChangeText('description', text)}
          />
        </Item>
      </Form>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
        <Button
          style={{ width: 200 }}
          label="Save"
          onPress={handleSubmit}
          isSubmitting={isSubmitting}
        />
        <Button
          style={{ width: 200 }}
          label="Cancel"
          onPress={() => navigation.navigate('MyMeds')}
        />
      </View>
    </Container>
  );
}

NewRecordForm.propTypes = {
  navigation: PropTypes.object.isRequired
};

