import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form } from 'native-base';

import {
  useDocument,
  Banner,
  Textbox,
  Button,
  GROUP_SHARING_FOR_USER,
  useCollection,
  USERS_COLLECTION,
  useSubmit,
  SHARED_GROUPS_SUBCOLLECTION,
} from '../common';

export default function MedicationGroupShare({ navigation }) {
  const groupId = navigation.getParam('groupId');
  const { data: users, getCollection } = useCollection();
  const { addDocument: addGroupSharing } = useDocument();
  const [isSubmitting, handleSubmit] = useSubmit(handleShare, 'Invitation submitted.');
  const [emails, setEmails] = React.useState();
  const splitEmailsRef = React.useRef();

  React.useEffect(
    () => {
      if (!users.length) return;
      saveGroupSharingAsync();

      async function saveGroupSharingAsync() {
        for (const email of splitEmailsRef.current) {
          const user = users.find(u => u.data().emailAddress.toLowerCase() === email.toLowerCase().trim());
          if (user) {
            const payload = {
              groupId,
              isAccepted: false,
            };
            await addGroupSharing(undefined, payload, `${GROUP_SHARING_FOR_USER}/${user.id}/${SHARED_GROUPS_SUBCOLLECTION}`);
          }
        }
        navigation.goBack();
      }
    },
    [addGroupSharing, groupId, navigation, users]
  );

  function handleShare() {
    splitEmailsRef.current = emails.split(',').filter(e => e);
    if (!splitEmailsRef.current.length) return;

    getCollection({ ref: USERS_COLLECTION, orderBy: 'emailAddress' });
  }

  return (
    <Container>
      <Banner iconName="share" description="Enter the email address separated by comma" />
      <Form>
        <Textbox
          iconName="mail"
          autoCapitalize="none"
          value={emails}
          onChangeText={text => setEmails(text)}
        />
      </Form>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
        <Button
          style={{ width: 200 }}
          label="Share"
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

MedicationGroupShare.navigationOptions = ({ navigation }) => ({
  title: `Share ${navigation.getParam('groupName')}`
});

MedicationGroupShare.propTypes = {
  navigation: PropTypes.object.isRequired
};
