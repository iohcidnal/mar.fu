import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import { Container, Fab, Icon, ListItem, Button, Body, Text, Spinner } from 'native-base';

import { Banner } from '../common';
import { db } from '../db';

export default function MyMeds({ navigation }) {
  const [myMeds, setMyMeds] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);

  const handleWillFocusScreen = async () => {
    const userUid = 'BaRGu3BEyBf1jz4OlfYHIxZ6Oqs1'; // TODO: get this from auth's current user
    const records = await db
      .collection('myMedRecords')
      .doc(userUid)
      .collection('records')
      .orderBy('name')
      .get();
    const myMeds = records.docs.reduce(
      (acc, record) => {
        acc.push(record.data());
        return acc;
      },
      []
    );
    setMyMeds(myMeds);
    setIsFetching(false);
  };

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { name, description } }) => {
    return (
      <ListItem onPress={() => console.log('TODO: record view')}>
        <Body>
          <View>
            <Text style={{ fontWeight: 'bold' }}>{name}</Text>
            <Text>{description}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <Button rounded bordered onPress={() => console.log('TODO: share')}>
              <Icon name="share" />
            </Button>
            <Button rounded bordered onPress={() => console.log('TODO: edit')}>
              <Icon name="create" />
            </Button>
            <Button rounded bordered onPress={() => console.log('TODO: delete')}>
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
      {!isFetching && myMeds.length === 0 && <Banner iconName="sad" description="You don't have a record at the moment. Please create a new one." />}
      <FlatList
        data={myMeds}
        keyExtractor={({ createdTimestamp }) => createdTimestamp.toString()}
        renderItem={renderItem}
      />
      <Fab onPress={() => navigation.navigate('NewRecordForm')}>
        <Icon name="add" />
      </Fab>
    </Container>
  );
}

MyMeds.navigationOptions = () => ({
  title: 'My Medication Records'
});

MyMeds.propTypes = {
  navigation: PropTypes.object.isRequired
};
