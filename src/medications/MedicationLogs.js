import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Body, Text, Container, Spinner } from 'native-base';

import { useCollection, MEDICATION_LOGS_COLLECTION, LOGS_SUBCOLLECTION } from '../common';
import dayjs from 'dayjs';

export default function MedicationLogs({ navigation }) {
  const medicationId = React.useRef(navigation.getParam('medicationId'));
  const { isBusy, data } = useCollection({
    ref: `${MEDICATION_LOGS_COLLECTION}/${medicationId.current}/${LOGS_SUBCOLLECTION}`,
    orderBy: 'lastTakenDateTime',
    isDescending: true
  });
  const [medicationLogs, setMedicationLogs] = React.useState(data);

  React.useEffect(
    () => {
      const result = data.reduce(
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
    },
    [data]
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
      {isBusy && <Spinner />}
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
