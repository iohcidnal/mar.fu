import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import { Container, Fab, Icon, ListItem, Body, Button, Text, Toast } from 'native-base';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { firestore } from 'firebase';

import { db } from '../db';
import { Banner, MEDICATIONS_FOR_GROUP_COLLECTION, MEDICATIONS_SUBCOLLECTION } from '../common';

function Medications({ navigation, showActionSheetWithOptions }) {
  const groupId = React.useRef(navigation.getParam('groupId'));
  const [medications, setMedications] = React.useState([]);

  const handleWillFocusScreen = async () => {
    const medicationsSnapshot = await db
      .collection(MEDICATIONS_FOR_GROUP_COLLECTION)
      .doc(groupId.current)
      .collection(MEDICATIONS_SUBCOLLECTION)
      .orderBy('name')
      .get();
    const medications = medicationsSnapshot.docs.reduce(
      (acc, med) => {
        acc.push({ id: med.id, ...med.data() });
        return acc;
      },
      []
    );
    setMedications(medications);
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
        duration: 8000,
        position: 'top',
        type: 'success'
      });
    }
  };

  const handleCompleteMedication = async ({ id, name }) => {
    // STOPHERE: implement completion
    // await db
    //   .collection('myMedRecords')
    //   .doc(userUid)
    //   .collection('records')
    //   .doc(groupId.current)
    //   .collection('medications')
    //   .doc(id)
    //   .add({
    //     administeredBy: userUid,
    //     dateTime: firestore.Timestamp.fromDate(new Date()),
    //   });

    Toast.show({
      text: `${name} successfully marked as completed`,
      buttonText: 'OK',
      duration: 8000,
      position: 'top',
      type: 'success'
    });
  };

  const renderItem = value => {
    const { item } = value;
    return (
      <ListItem>
        <Body>
          <View>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{`Last taken date/time: ${item.lastTakenDateTime || ''}`}</Text>
            <Text>{`Administered by: ${item.administeredBy || ''}`}</Text>
            <Text>{`Note: ${item.note || ''}`}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Button rounded bordered onPress={() => handleCompleteMedication(item)}>
              <Icon name="checkmark-circle" />
            </Button>
            {/* TODO: list history */}
            <Button rounded bordered onPress={() => console.log('TODO: list history')}>
              <Icon name="list" />
            </Button>
            <Button rounded bordered onPress={() => handleEdit(item)}>
              <Icon name="create" />
            </Button>
            <Button rounded bordered onPress={() => handleDelete(item)}>
              <Icon name="trash" />
            </Button>
          </View>
        </Body>
      </ListItem>
    );
  };

  return (
    <Container>
      <NavigationEvents onWillFocus={handleWillFocusScreen} />
      {medications.length === 0 && <Banner iconName="sad" description="You don't have medications at the moment. Please create a new one." />}
      <FlatList
        data={medications}
        keyExtractor={item => item.createdTimestamp.toString()}
        renderItem={renderItem}
      />
      <Fab onPress={() => navigation.navigate('MedicationForm', { groupId: groupId.current })}>
        <Icon name="add" />
      </Fab>
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
