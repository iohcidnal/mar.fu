import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Form, Item, Input, Icon } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import { useHandleChangeText, useSubmit, Banner, Button } from '../common';
import { auth } from '../db';

export const styles = StyleSheet.create({
  loginSignUpSegmentedStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  }
});

const initialState = {
  emailAddress: '',
  password: ''
};

export default function Login({ navigation }) {
  const [state, handleChangeText] = useHandleChangeText(initialState);
  const [isSubmitting, handleSubmit] = useSubmit(loginAsync);
  const shouldNavigateSetParams = React.useRef(true);

  React.useEffect(
    () => {
      if (shouldNavigateSetParams.current) {
        navigation.setParams({ handleSegmentChange: () => navigation.navigate('SignUp') });
      }
      shouldNavigateSetParams.current = false;
    },
    [navigation]
  );

  async function loginAsync() {
    await auth.signInWithEmailAndPassword(state.emailAddress, state.password);
    navigation.navigate('MedicationGroups');
  }

  return (
    <View>
      <Banner iconName="happy" title="Welcome to mar.fu" description="Use your email and password to log in to your account." />
      <View>
        <Form>
          <Item>
            <Icon active name="mail" />
            <Input
              placeholder="Email address"
              textContentType="emailAddress"
              autoCapitalize="none"
              value={state.emailAddress}
              onChangeText={text => handleChangeText('emailAddress', text)}
            />
          </Item>
          <Item fixedLabel>
            <Icon active name="lock" />
            <Input
              placeholder="Password"
              textContentType="password"
              secureTextEntry
              value={state.password}
              onChangeText={text => handleChangeText('password', text)}
            />
          </Item>
          <Button
            label="Login"
            style={{ margin: 20 }}
            isSubmitting={isSubmitting}
            onPress={handleSubmit}
          />
        </Form>
      </View>
    </View>
  );
}

Login.navigationOptions = ({ navigation }) => ({
  headerTitle:
    <View style={styles.loginSignUpSegmentedStyle}>
      <SegmentedControlTab
        tabsContainerStyle={{ width: 200 }}
        values={['Login', 'Sign up']}
        selectedIndex={0}
        onTabPress={navigation.getParam('handleSegmentChange')}
      />
    </View>
});

Login.propTypes = {
  navigation: PropTypes.object.isRequired,
};
