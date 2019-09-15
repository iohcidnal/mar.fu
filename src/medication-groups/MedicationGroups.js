import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import { Container, Fab, Icon, ListItem, Button, Body, Text, Spinner, Toast } from 'native-base';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import { Banner, GROUPS_FOR_USER_COLLECTION, GROUPS_SUBCOLLECTION } from '../common';
import { db } from '../db';

const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user

function MedicationGroups({ navigation, showActionSheetWithOptions }) {
  const [medicationGroups, setMedicationGroups] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);

  const handleWillFocusScreen = async () => {
    const records = await db
      .collection(GROUPS_FOR_USER_COLLECTION)
      .doc(userUid)
      .collection(GROUPS_SUBCOLLECTION)
      .orderBy('name')
      .get();
    const result = records.docs.reduce(
      (acc, record) => {
        acc.push({ id: record.id, ...record.data() });
        return acc;
      },
      []
    );
    setMedicationGroups(result);
    setIsFetching(false);
  };

  const handleViewMedications = ({ id: groupId, name }) => {
    navigation.navigate('Medications', {
      groupId,
      medicationTitle: `${name} Medications`
    });
  };

  const handleEdit = ({ id, name, description }) => {
    navigation.navigate('MedicationGroupForm', {
      initialState: {
        id,
        name,
        description,
      }
    });
  };

  const handleDelete = ({ id, name }) => {
    showActionSheetWithOptions(
      {
        options: ['Delete', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: `Delete ${name}?`,
        message: 'This will permanently remove this medication group.'
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteRecordAsync();
        }
      });

    async function deleteRecordAsync() {
      await db
        .collection(GROUPS_FOR_USER_COLLECTION)
        .doc(userUid)
        .collection(GROUPS_SUBCOLLECTION)
        .doc(id)
        .delete();

      const index = medicationGroups.findIndex(m => m.id === id);
      setMedicationGroups(meds => {
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

  const renderItem = value => {
    const { item } = value;
    return (
      <ListItem onPress={() => handleViewMedications(item)}>
        <Body>
          <View>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Button rounded bordered onPress={() => console.log('TODO: share')}>
              <Icon name="share" />
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
      {isFetching && <Spinner />}
      {!isFetching && medicationGroups.length === 0 && <Banner iconName="sad" description="You don't have any medication groups at the moment. Please create a new one." />}
      <FlatList
        data={medicationGroups}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <Fab onPress={() => navigation.navigate('MedicationGroupForm')}>
        <Icon name="add" />
      </Fab>
    </Container>
  );
}

const component = connectActionSheet(MedicationGroups);
component.navigationOptions = {
  title: 'My Medication Groups'
};

MedicationGroups.propTypes = {
  navigation: PropTypes.object.isRequired,
  showActionSheetWithOptions: PropTypes.func.isRequired,
};

export default component;
