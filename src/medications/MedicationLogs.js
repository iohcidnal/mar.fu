import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Body, Text, Container } from 'native-base';

import { db } from '../db';
import { MEDICATION_LOGS_COLLECTION, LOGS_SUBCOLLECTION } from '../common';
import dayjs from 'dayjs';

export default function MedicationLogs({ navigation }) {
  const medicationId = React.useRef(navigation.getParam('medicationId'));
  const [medicationLogs, setMedicationLogs] = React.useState([]);

  React.useEffect(
    () => {
      getLogs();

      async function getLogs() {
        const logs = await db
          .collection(MEDICATION_LOGS_COLLECTION)
          .doc(medicationId.current)
          .collection(LOGS_SUBCOLLECTION)
          .orderBy('lastTakenDateTime', 'desc')
          .get();
        const result = logs.docs.reduce(
          (acc, log) => {
            const data = log.data();
            acc.push({
              id: log.id,
              lastTakenDateTime: dayjs(data.lastTakenDateTime.toDate()).format('ddd D MMM YYYY h:mm A'),
              administeredBy: data.administeredBy
            });
            return acc;
          },
          []
        );
        setMedicationLogs(result);
      }
    },
    []
  );

  const renderItem = value => {
    const { item } = value;
    return (
      <ListItem>
        <Body>
          <View>
            <Text>{`Completed on: ${item.lastTakenDateTime}`}</Text>
            <Text>{`Administered by: ${item.administeredBy}`}</Text>
          </View>
        </Body>
      </ListItem>
    );
  };

  return (
    <Container>
      <FlatList
        data={medicationLogs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </Container>
  );
}

MedicationLogs.navigationOptions = ({ navigation }) => ({
  title: `${navigation.getParam('medicationName', 'Medication')} Logs`
});

MedicationLogs.propTypes = {
  navigation: PropTypes.object.isRequired
};
