import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Form, Item, Input, Button, Text, Icon, Toast } from 'native-base';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import { useHandleChangeText } from '../common';
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

  async function handleLogin() {
    try {
      await auth.signInWithEmailAndPassword(state.emailAddress, state.password);
      // STOPHERE: navigate to family member screen
    } catch (error) {
      Toast.show({
        text: error.message,
        buttonText: 'OK',
        duration: 8000,
        position: 'top',
        type: 'danger',
      });
    }
  }

  return (
    <Container>
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
          <Button block style={{ margin: 20 }} onPress={handleLogin}>
            <Text>Login</Text>
          </Button>
        </Form>
      </View>
    </Container>
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
