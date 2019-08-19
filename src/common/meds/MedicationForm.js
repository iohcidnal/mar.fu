import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';
import firebase from 'firebase';

import Banner from '../Banner';
import Textbox from '../Textbox';
import useHandleChangeText from '../useHandleChangeText';
import useSubmit from '../useSubmit';
import { doesExist } from '../validations';
import useValidation from '../useValidation';
import Button from '../Button';

import { auth, db } from '../../db';

const initialState = {
  name: '',
  dosage: '',
  frequency: '',
  note: ''
};

export default function MedicationForm({ navigation }) {
  const recordId = React.useRef(navigation.getParam('recordId'));
  const [state, handleChangeText] = useHandleChangeText(navigation.getParam('initialState', initialState));
  const [isSubmitting, handleSubmit] = useSubmit(saveForm, `${state.id ? 'Medication updated' : 'New medication created'} successfully.`);
  const [validate, validationError] = useValidation(() => validateForm());

  async function saveForm() {
    validate();

    const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user
    const docRef = db
      .collection('myMedRecords')
      .doc(userUid)
      .collection('records')
      .doc(recordId.current);

    if (state.id) {
      const { id, ...medication } = state;
      await docRef.collection('medications')
        .doc(id)
        .set({ ...medication }, { merge: true });
    } else {
      await docRef.collection('medications')
        .add({
          ...state,
          createdTimestamp: firebase.firestore.FieldValue.serverTimestamp()
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
