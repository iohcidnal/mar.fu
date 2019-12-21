import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Body, Text, Container, Spinner, Icon } from 'native-base';

import { useCollection, Banner, MEDICATION_LOGS_COLLECTION, LOGS_SUBCOLLECTION } from '../common';
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
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Icon style={{ color: 'gray' }} name="checkmark-circle" />
            <Text>{item.lastTakenDateTime}</Text>
          </View>
          {/* <Text>{`Administered by: ${item.administeredBy}`}</Text> */}
        </Body>
      </ListItem>
    );
  };

  return (
    <Container>
      {isBusy && <Spinner />}
      {!isBusy && medicationLogs.length === 0 && <Banner iconName="sad" description="No records showing that you've taken this medication." />}
      <FlatList
        data={medicationLogs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </Container>
  );
}

MedicationLogs.navigationOptions = ({ navigation }) => ({
  title: `${navigation.getParam('medicationName', 'Medication')} - Dates Taken`
});

MedicationLogs.propTypes = {
  navigation: PropTypes.object.isRequired
};
