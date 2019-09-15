import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';
import firebase from 'firebase';

import { Banner, Button, Textbox, useHandleChangeText, useSubmit, doesExist, useValidation, GROUPS_FOR_USER_COLLECTION, GROUPS_SUBCOLLECTION, USERS_COLLECTION } from '../common';
import { auth, db } from '../db';

const initialState = {
  name: '',
  description: ''
};

const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user

export default function MedicationGroupForm({ navigation }) {
  const [state, handleChangeText] = useHandleChangeText(navigation.getParam('initialState', initialState));
  const [isSubmitting, handleSubmit] = useSubmit(saveForm, `${state.id ? 'Medication group updated' : 'New medication group created'} successfully.`);
  const [validate, validationError] = useValidation(() => validateForm());

  async function saveForm() {
    validate();

    const docRef = db.collection(GROUPS_FOR_USER_COLLECTION).doc(userUid);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.data()) {
      // create a reference
      await docRef.set({
        reference: db
          .collection(USERS_COLLECTION)
          .doc(userUid)
      });
    }

    if (state.id) {
      await docRef.collection(GROUPS_SUBCOLLECTION).doc(state.id)
        .set({
          name: state.name,
          description: state.description,
        }, { merge: true });
    } else {
      await docRef.collection(GROUPS_SUBCOLLECTION)
        .add({
          name: state.name,
          description: state.description,
          sharedWith: [],
          createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date())
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
      <Banner title={`${state.id ? 'Update' : 'New'} Medication Group`} iconName="folder" />
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

MedicationGroupForm.propTypes = {
  navigation: PropTypes.object.isRequired
};
