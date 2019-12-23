import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';

import {
  Banner,
  Textbox,
  useDocument,
  useHandleChangeText,
  useSubmit,
  doesExist,
  useValidation,
  Button,
  MEDICATIONS_FOR_GROUP_COLLECTION,
  MEDICATIONS_SUBCOLLECTION,
  GROUPS_FOR_USER_COLLECTION,
  GROUPS_SUBCOLLECTION,
  Fab
} from '../common';
import { auth } from '../db';

const initialState = {
  name: '',
  dosage: '',
  frequency: '',
  note: ''
};

export default function MedicationForm({ navigation }) {
  const groupId = React.useRef(navigation.getParam('groupId'));
  const { docRef, getDocument, updateDocument, addDocument, isSubmitting } = useDocument();
  const { docRef: groupRef } = useDocument(`${GROUPS_FOR_USER_COLLECTION}/${auth.currentUser.uid}/${GROUPS_SUBCOLLECTION}/${groupId.current}`);
  const [state, handleChangeText] = useHandleChangeText(navigation.getParam('initialState', initialState));
  const [, handleSubmit] = useSubmit(saveForm, `${state.id ? 'Medication updated' : 'New medication created'} successfully.`);
  const [validate, validationError] = useValidation(() => validateForm());

  React.useEffect(
    () => {
      if (!docRef) return;
      saveFormAsync();

      async function saveFormAsync() {
        const docSnapshot = await docRef.get();
        if (!docSnapshot.data()) {
          // create a reference
          await updateDocument(undefined, { reference: groupRef }, false);
        }

        const { id, ...medication } = state;
        if (id) {
          await updateDocument(`${MEDICATIONS_SUBCOLLECTION}/${id}`, medication);
        } else {
          await addDocument(MEDICATIONS_SUBCOLLECTION, medication);
        }

        navigation.goBack();
      }
    },
    [addDocument, docRef, groupRef, navigation, state, updateDocument]
  );

  function saveForm() {
    validate();
    getDocument(`${MEDICATIONS_FOR_GROUP_COLLECTION}/${groupId.current}`);
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
          iconName="pill"
          iconType="MaterialCommunityIcons"
          placeholder="Name"
          autoCapitalize="words"
          value={state.name}
          onChangeText={text => handleChangeText('name', text)}
          errorMessage={validationError.name}
        />
        <Textbox
          iconName="counter"
          iconType="MaterialCommunityIcons"
          placeholder="Dosage"
          value={state.dosage}
          onChangeText={text => handleChangeText('dosage', text)}
          errorMessage={validationError.dosage}
        />
        <Textbox
          iconName="calendar-clock"
          iconType="MaterialCommunityIcons"
          placeholder="Frequency"
          value={state.frequency}
          onChangeText={text => handleChangeText('frequency', text)}
          errorMessage={validationError.frequency}
        />
        <Textbox
          iconName="note-text"
          iconType="MaterialCommunityIcons"
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
      <Fab shouldShowAdd={false} />
    </Container>
  );
}

MedicationForm.propTypes = {
  navigation: PropTypes.object.isRequired
};
