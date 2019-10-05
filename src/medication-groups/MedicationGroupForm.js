import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';

import {
  Banner,
  Button,
  Textbox,
  useDocument,
  useHandleChangeText,
  useSubmit,
  doesExist,
  useValidation,
  GROUPS_FOR_USER_COLLECTION,
  GROUPS_SUBCOLLECTION,
  USERS_COLLECTION
} from '../common';
import { auth, db } from '../db';

const initialState = {
  name: '',
  description: ''
};

const userUid = 'yMZNNavHRJfVDlaTvfYdYpOncZB3'; // TODO: get this from auth's current user

export default function MedicationGroupForm({ navigation }) {
  const { docRef, getDocument, updateDocument, addDocument, isSubmitting } = useDocument();
  const { docRef: userRef } = useDocument(`${USERS_COLLECTION}/${userUid}`);
  const [state, handleChangeText] = useHandleChangeText(navigation.getParam('initialState', initialState));
  const [, handleSubmit] = useSubmit(saveForm, `${state.id ? 'Medication group updated' : 'New medication group created'} successfully.`);
  const [validate, validationError] = useValidation(() => validateForm());

  React.useEffect(
    () => {
      if (!docRef) return;
      saveFormAsync();

      async function saveFormAsync() {
        const docSnapshot = await docRef.get();
        if (!docSnapshot.data()) {
          // create a reference
          await updateDocument(undefined, { reference: userRef }, false);
        }

        const { id, ...group } = state;
        if (id) {
          await updateDocument(`${GROUPS_SUBCOLLECTION}/${id}`, group);
        } else {
          await addDocument(GROUPS_SUBCOLLECTION, {
            ...group,
            sharedWith: [],
          });
        }

        navigation.goBack();
      }
    },
    [addDocument, docRef, navigation, state, updateDocument, userRef]
  );

  function saveForm() {
    validate();
    getDocument(`${GROUPS_FOR_USER_COLLECTION}/${userUid}`);
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
