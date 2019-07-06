import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Form, Item, Input, Icon } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useHandleChangeText, useSubmit, doesExist, isExact, HelpText, Banner, Button } from '../common';
import { auth, db } from '../db';
import { styles } from '../login/index';

const initialState = {
  name: null,
  emailAddress: null,
  password: null,
  confirmPassword: null,
};

export default function SignUp({ navigation }) {
  const [state, handleChangeText, resetState] = useHandleChangeText(initialState);
  const [isSubmitting, handleSubmit] = useSubmit(signUpAsync, 'Your account has been created. Please check your email to verify your account.');
  const [validationError, setValidationError] = React.useState({});
  const shouldNavigateSetParams = React.useRef(true);

  React.useEffect(
    () => {
      if (shouldNavigateSetParams.current) {
        navigation.setParams({ handleSegmentChange: () => navigation.navigate('Login') });
      }
      shouldNavigateSetParams.current = false;
    },
    [navigation]
  );

  async function getInvitation() {
    // If the email was invited, then the inviter will be the memberOfUid in the users collection
    // making this email a family member of the inviter.
    const doc = db
      .collection('invites')
      .doc(state.emailAddress.toLowerCase().trim());
    const invite = await doc.get();

    if (invite.exists) {
      await doc.set({ didAcceptInvite: true }, { merge: true });
      return invite.data().memberOfUid;
    }

    return null;
  }

  async function signUpAsync() {
    const validationError = validate();
    setValidationError(validationError);
    if (Object.keys(validationError).length) throw new Error('Please fix required fields.');

    const userCredential = await auth.createUserWithEmailAndPassword(state.emailAddress, state.password);
    const memberOfUid = await getInvitation();
    await db
      .collection('users')
      .doc(userCredential.user.uid)
      .set(
        {
          uid: userCredential.user.uid,
          name: state.name,
          memberOfUid: memberOfUid || userCredential.user.uid,
          lowerCaseName: state.name.toLowerCase()
        },
        { merge: true }
      );
    await auth.currentUser.updateProfile({ displayName: state.name });
    await auth.currentUser.sendEmailVerification();
    await auth.signOut();

    resetState();
  }

  function validate() {
    const { name, emailAddress, password, confirmPassword } = state;
    return {
      ...(!doesExist(name) && { name: 'Required' }),
      ...(!doesExist(emailAddress) && { emailAddress: 'Required' }),
      ...(!doesExist(password) && { password: 'Required' }),
      ...(!doesExist(confirmPassword) && { confirmPassword: 'Required' }),
      ...(!isExact(password, confirmPassword) && { confirmPassword: 'Passwords do not match' }),
    };
  }

  return (
    <KeyboardAwareScrollView>
      <View>
        <Banner iconName="person-add" title="Sign up" description="If your email was invited, you will be a family member of the inviter." />
        <Form>
          <Item error={!!validationError.name}>
            <Icon active name="person" />
            <Input
              placeholder="Name"
              textContentType="givenName"
              autoCapitalize="words"
              value={state.name}
              onChangeText={text => handleChangeText('name', text)}
            />
            <HelpText message={validationError.name} />
          </Item>
          <Item error={!!validationError.emailAddress}>
            <Icon active name="mail" />
            <Input
              placeholder="Email address"
              textContentType="emailAddress"
              autoCapitalize="none"
              value={state.emailAddress}
              onChangeText={text => handleChangeText('emailAddress', text)}
            />
            <HelpText message={validationError.emailAddress} />
          </Item>
          <Item error={!!validationError.password}>
            <Icon active name="lock" />
            <Input
              placeholder="Password"
              textContentType="password"
              secureTextEntry
              value={state.password}
              onChangeText={text => handleChangeText('password', text)}
            />
            <HelpText message={validationError.password} />
          </Item>
          <Item error={!!validationError.confirmPassword}>
            <Icon active name="lock" />
            <Input
              placeholder="Confirm password"
              textContentType="password"
              secureTextEntry
              value={state.confirmPassword}
              onChangeText={text => handleChangeText('confirmPassword', text)}
            />
            <HelpText message={validationError.confirmPassword} />
          </Item>
          <Button
            label="Sign up"
            style={{ margin: 20 }}
            isSubmitting={isSubmitting}
            onPress={handleSubmit}
          />
        </Form>
      </View>
    </KeyboardAwareScrollView>
  );
}

SignUp.navigationOptions = ({ navigation }) => ({
  headerTitle:
    <View style={styles.loginSignUpSegmentedStyle}>
      <SegmentedControlTab
        tabsContainerStyle={{ width: 200 }}
        values={['Login', 'Sign up']}
        selectedIndex={1}
        onTabPress={navigation.getParam('handleSegmentChange')}
      />
    </View>
});

SignUp.propTypes = {
  navigation: PropTypes.object.isRequired,
};
