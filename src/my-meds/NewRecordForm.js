import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';
import firebase from 'firebase';

import { Banner, Button, Textbox, useHandleChangeText, useSubmit, doesExist, useValidation } from '../common';
import { auth, db } from '../db';

const initialState = {
  name: '',
  description: ''
};

export default function NewRecordForm({ navigation }) {
  const [state, handleChangeText] = useHandleChangeText(initialState);
  const [isSubmitting, handleSubmit] = useSubmit(addNewRecord, 'New record created successfully.');
  const [validate, validationError] = useValidation(() => validateForm());

  async function addNewRecord() {
    validate();

    const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user
    const docRef = db.collection('myMedRecords').doc(userUid);
    await docRef.collection('records')
      .add({
        name: state.name,
        description: state.description,
        sharedWith: [],
        medications: [],
        createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    navigation.goBack();
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
          onPress={() => navigation.goBack()}
        />
      </View>
    </Container>
  );
}

NewRecordForm.propTypes = {
  navigation: PropTypes.object.isRequired
};
