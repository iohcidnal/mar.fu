import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';

import { Banner, Button, Textbox, useHandleChangeText, useSubmit, doesExist, useValidation } from '../common';
import { auth, db } from '../db';

const initialState = {
  name: '',
  description: ''
};

export default function NewRecordForm({ navigation }) {
  const [state, handleChangeText] = useHandleChangeText(initialState);
  const [isSubmitting, handleSubmit] = useSubmit(createNewRecord, 'New record created successfully.');
  const [validate, validationError] = useValidation(() => validateForm());

  async function createNewRecord() {
    validate();

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

  function validateForm() {
    return {
      ...(!doesExist(state.name) && { name: 'Required' }),
      ...(!doesExist(state.description) && { description: 'Required' }),
    };
  }

  return (
    <Container>
      <Banner title="New Record" iconName="folder" />
      <Form>
        <Textbox
          iconName="folder"
          placeholder="Name"
          autoCapitalize="words"
          value={state.name}
          onChangeText={text => handleChangeText('name', text)}
          errorMessage={validationError.name}
        />
        <Textbox
          iconName="description"
          iconType="MaterialIcons"
          placeholder="Description"
          value={state.description}
          onChangeText={text => handleChangeText('description', text)}
          errorMessage={validationError.description}
        />
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
