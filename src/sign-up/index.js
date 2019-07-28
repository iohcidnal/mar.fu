import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Form } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useHandleChangeText, useSubmit, doesExist, isExact, Textbox, Banner, Button, useValidation } from '../common';
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
  const [validate, validationError] = useValidation(() => validateForm());
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

  async function signUpAsync() {
    validate();

    const userCredential = await auth.createUserWithEmailAndPassword(state.emailAddress, state.password);
    await db
      .collection('users')
      .doc(userCredential.user.uid)
      .set(
        {
          uid: userCredential.user.uid,
          name: state.name,
          memberOfUid: null,
          lowerCaseName: state.name.toLowerCase()
        },
        { merge: true }
      );
    await auth.currentUser.updateProfile({ displayName: state.name });
    await auth.currentUser.sendEmailVerification();
    await auth.signOut();

    resetState();
  }

  function validateForm() {
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
        <Banner iconName="person-add" title="Sign up" description="Create an account to keep track of your family's medications." />
        <Form>
          <Textbox
            iconName="person"
            placeholder="Name"
            textContentType="givenName"
            autoCapitalize="words"
            value={state.name}
            onChangeText={text => handleChangeText('name', text)}
            errorMessage={validationError.name}
          />
          <Textbox
            iconName="mail"
            placeholder="Email address"
            textContentType="emailAddress"
            autoCapitalize="none"
            value={state.emailAddress}
            onChangeText={text => handleChangeText('emailAddress', text)}
            errorMessage={validationError.emailAddress}
          />
          <Textbox
            iconName="lock"
            placeholder="Password"
            textContentType="password"
            secureTextEntry
            value={state.password}
            onChangeText={text => handleChangeText('password', text)}
            errorMessage={validationError.password}
          />
          <Textbox
            iconName="lock"
            placeholder="Confirm password"
            textContentType="password"
            secureTextEntry
            value={state.confirmPassword}
            onChangeText={text => handleChangeText('confirmPassword', text)}
            errorMessage={validationError.confirmPassword}
          />
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
