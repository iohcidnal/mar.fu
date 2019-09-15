import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';
import firebase from 'firebase';

import { Banner, Textbox, useHandleChangeText, useSubmit, doesExist, useValidation, Button, MEDICATIONS_FOR_GROUP_COLLECTION, MEDICATIONS_SUBCOLLECTION, GROUPS_FOR_USER_COLLECTION, GROUPS_SUBCOLLECTION } from '../common';
import { db } from '../db';

const initialState = {
  name: '',
  dosage: '',
  frequency: '',
  note: ''
};

const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user

export default function MedicationForm({ navigation }) {
  const groupId = React.useRef(navigation.getParam('groupId'));
  const [state, handleChangeText] = useHandleChangeText(navigation.getParam('initialState', initialState));
  const [isSubmitting, handleSubmit] = useSubmit(saveForm, `${state.id ? 'Medication updated' : 'New medication created'} successfully.`);
  const [validate, validationError] = useValidation(() => validateForm());

  async function saveForm() {
    validate();

    const docRef = db.collection(MEDICATIONS_FOR_GROUP_COLLECTION).doc(groupId.current);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.data()) {
      // create a reference
      await docRef.set({
        reference: db
          .collection(GROUPS_FOR_USER_COLLECTION)
          .doc(userUid)
          .collection(GROUPS_SUBCOLLECTION)
          .doc(groupId.current)
      });
    }

    if (state.id) {
      const { id, ...medication } = state;
      await docRef.collection(MEDICATIONS_SUBCOLLECTION)
        .doc(id)
        .set({ ...medication }, { merge: true });
    } else {
      await docRef.collection(MEDICATIONS_SUBCOLLECTION)
        .add({
          ...state,
          createdTimestamp: firebase.firestore.Timestamp.fromDate(new Date())
        });
    }

    navigation.goBack();
  }

  function validateForm() {
    return {
      ...(!doesExist(state.name) && { name: 'Required' }),
      ...(!doesExist(state.dosage) && { dosage: 'Required' }),
      ...(!doesExist(state.frequency) && { frequency: 'Required' }),
    };
  }

  return (
    <Container>
      <Banner title={`${state.id ? 'Update' : 'New'} Medication`} />
      <Form>
        <Textbox
          placeholder="Name"
          autoCapitalize="words"
          value={state.name}
          onChangeText={text => handleChangeText('name', text)}
          errorMessage={validationError.name}
        />
        <Textbox
          placeholder="Dosage"
          value={state.dosage}
          onChangeText={text => handleChangeText('dosage', text)}
          errorMessage={validationError.dosage}
        />
        <Textbox
          placeholder="Frequency"
          value={state.frequency}
          onChangeText={text => handleChangeText('frequency', text)}
          errorMessage={validationError.frequency}
        />
        <Textbox
          placeholder="Note"
          value={state.note}
          onChangeText={text => handleChangeText('note', text)}
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

MedicationForm.propTypes = {
  navigation: PropTypes.object.isRequired
};
