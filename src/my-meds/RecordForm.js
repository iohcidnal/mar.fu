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

export default function RecordForm({ navigation }) {
  const [state, handleChangeText] = useHandleChangeText(navigation.getParam('initialState', initialState));
  const [isSubmitting, handleSubmit] = useSubmit(saveForm, `${state.id ? 'Record updated' : 'New record created'} successfully.`);
  const [validate, validationError] = useValidation(() => validateForm());

  async function saveForm() {
    validate();

    const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user
    const docRef = db.collection('myMedRecords').doc(userUid);

    if (state.id) {
      await docRef.collection('records').doc(state.id)
        .set({
          name: state.name,
          description: state.description,
        }, { merge: true });
    } else {
      await docRef.collection('records')
        .add({
          name: state.name,
          description: state.description,
          sharedWith: [],
          createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

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
      <Banner title={`${state.id ? 'Update' : 'New'} Record`} iconName="folder" />
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

RecordForm.propTypes = {
  navigation: PropTypes.object.isRequired
};
