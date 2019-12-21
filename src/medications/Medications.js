import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import { Container, Icon, ListItem, Body, Button, Text, Toast, Spinner, Right } from 'native-base';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { firestore } from 'firebase';
import dayjs from 'dayjs';

import { db, auth } from '../db';
import {
  useCollection,
  Banner,
  Fab,
  MEDICATIONS_FOR_GROUP_COLLECTION,
  MEDICATIONS_SUBCOLLECTION,
  MEDICATION_LOGS_COLLECTION,
  LOGS_SUBCOLLECTION,
  uniqueId,
  USERS_COLLECTION,
  duration,
  SubText
} from '../common';

function Medications({ navigation, showActionSheetWithOptions }) {
  const { getCollection, isBusy, data } = useCollection();
  const groupId = React.useRef(navigation.getParam('groupId'));
  const [medications, setMedications] = React.useState([]);
  const [selectedMedication, setSelectedMedication] = React.useState(null);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = React.useState(false);
  const administeredByRef = React.useRef({
    docRef: db.collection(USERS_COLLECTION).doc(auth.currentUser.uid),
    name: null
  });

  React.useEffect(
    () => {
      const medications = data.reduce(
        (acc, med) => {
          acc.push({ id: med.id, ...med.data() });
          return acc;
        },
        []
      );
      setMedications(medications);
    },
    [data]
  );

  const getAdministeredByName = async () => {
    const current = administeredByRef.current;
    if (!current.name) {
      const user = await current.docRef.get();
      current.name = user.data().name;
    }

    return current.name;
  };

  const handleWillFocusScreen = async () => {
    const config = {
      ref: `${MEDICATIONS_FOR_GROUP_COLLECTION}/${groupId.current}/${MEDICATIONS_SUBCOLLECTION}`,
      orderBy: 'name'
    };
    getCollection(config);
  };

  const handleViewMedicationLogs = ({ id: medicationId, name: medicationName }) => {
    navigation.navigate('MedicationLogs', { medicationId, medicationName });
  };

  const handleComplete = item => {
    setSelectedMedication(item);
    setIsDateTimePickerVisible(true);
  };

  const handleEdit = item => {
    navigation.navigate('MedicationForm', {
      initialState: { ...item },
      groupId: groupId.current
    });
  };

  const handleDelete = ({ id, name }) => {
    showActionSheetWithOptions(
      {
        options: ['Delete', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: `Delete ${name}?`,
        message: 'This will permanently remove this medication.'
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteAsync();
        }
      });

    async function deleteAsync() {
      await db
        .collection(MEDICATIONS_FOR_GROUP_COLLECTION)
        .doc(groupId.current)
        .collection(MEDICATIONS_SUBCOLLECTION)
        .doc(id)
        .delete();

      const index = medications.findIndex(m => m.id === id);
      setMedications(meds => {
        return [
          ...meds.slice(0, index),
          ...meds.slice(index + 1)
        ];
      });

      Toast.show({
        text: `${name} deleted successfully.`,
        buttonText: 'OK',
        duration,
        position: 'bottom',
        type: 'success'
      });
    }
  };

  const handleConfirmCompleteMedication = async date => {
    setIsDateTimePickerVisible(false);
    const { id, name } = selectedMedication;
    const batch = db.batch();
    const docRef = db.collection(MEDICATION_LOGS_COLLECTION).doc(id);
    const docSnapshot = await docRef.get();
    const administeredBy = await getAdministeredByName();
    const log = {
      administeredBy,
      lastTakenDateTime: firestore.Timestamp.fromDate(date),
    };

    if (!docSnapshot.data()) {
      // create a reference
      batch.set(docRef, {
        reference: db
          .collection(MEDICATIONS_FOR_GROUP_COLLECTION)
          .doc(groupId.current)
          .collection(MEDICATIONS_SUBCOLLECTION)
          .doc(id)
      });
    }

    const logRef = docRef.collection(LOGS_SUBCOLLECTION).doc(uniqueId.newId());
    batch.set(logRef, log);

    // Update medication's latest log. This can also be done using data validation for atomic operations:
    // https://firebase.google.com/docs/firestore/manage-data/transactions#data_validation_for_atomic_operations
    const medsRef = db
      .collection(MEDICATIONS_FOR_GROUP_COLLECTION)
      .doc(groupId.current)
      .collection(MEDICATIONS_SUBCOLLECTION)
      .doc(id);
    batch.update(medsRef, { currentLog: { ...log } });

    await batch.commit();

    const selectedMedicationIndex = medications.findIndex(m => m.id === id);
    const medication = {
      ...medications[selectedMedicationIndex],
      currentLog: { ...log }
    };
    setMedications(medications => [
      ...medications.slice(0, selectedMedicationIndex),
      medication,
      ...medications.slice(selectedMedicationIndex + 1)
    ]);

    Toast.show({
      text: `${name} successfully marked as completed`,
      buttonText: 'OK',
      duration,
      position: 'bottom',
      type: 'success'
    });
  };

  const renderItem = value => {
    const { item } = value;
    return (
      <ListItem onPress={() => handleViewMedicationLogs(item)}>
        <Body>
          <View>
            <Text style={{ fontSize: 17 }}>{item.name}</Text>
            <SubText text={`Dosage: ${item.dosage}`} />
            <SubText text={`Frequency: ${item.frequency}`} />
            <SubText text={`Note: ${item.note}`} />
            {item.currentLog &&
              <React.Fragment>
                <Text style={{ color: '#DD5144', width: '100%' }}>{`Last taken: ${dayjs(item.currentLog.lastTakenDateTime.toDate()).format('ddd D MMM YYYY h:mm A')}`}</Text>
              </React.Fragment>
            }
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
            <Button transparent onPress={() => handleComplete(item)}>
              <Icon name="checkmark-circle" />
            </Button>
            <Button transparent onPress={() => handleEdit(item)}>
              <Icon name="create" />
            </Button>
            <Button transparent onPress={() => handleDelete(item)}>
              <Icon name="trash" />
            </Button>
          </View>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  };

  return (
    <Container>
      <NavigationEvents onWillFocus={handleWillFocusScreen} />
      {isBusy && <Spinner />}
      {!isBusy && medications.length === 0 && <Banner iconName="sad" description="You don't have medications at the moment. Please create a new one." />}
      <FlatList
        data={medications}
        keyExtractor={item => item.createdTimestamp.toString()}
        renderItem={renderItem}
      />
      <DateTimePicker
        mode="datetime"
        titleIOS={selectedMedication && `${selectedMedication.name} - Date and time of administration`}
        date={new Date()}
        is24Hour={false}
        isVisible={isDateTimePickerVisible}
        onConfirm={handleConfirmCompleteMedication}
        onCancel={() => setIsDateTimePickerVisible(false)}
      />
      <Fab onAdd={() => navigation.navigate('MedicationForm', { groupId: groupId.current })} />
    </Container>
  );
}

const component = connectActionSheet(Medications);
component.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('medicationTitle', 'Medications')
});

Medications.propTypes = {
  navigation: PropTypes.object.isRequired,
  showActionSheetWithOptions: PropTypes.func.isRequired,
};

export default component;
