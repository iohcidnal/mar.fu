import React from 'react';
import { Container, Content, Form, Item, Input, Button, Text, Icon, Toast } from 'native-base';
import { useHandleChangeText } from '../common';
import { auth } from '../db';

const initialState = {
  emailAddress: '',
  password: ''
};

export default function Login() {
  const [state, handleChangeText] = useHandleChangeText(initialState);

  async function handleLogin() {
    try {
      await auth.signInWithEmailAndPassword(state.emailAddress, state.password);
      // STOPHERE: navigate to family member screen
    } catch (error) {
      Toast.show({
        text: error.message,
        buttonText: 'Okay',
        duration: 5000,
        type: 'danger',
      });
    }
  }

  return (
    <Container>
      <Content>
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
      </Content>
    </Container>
  );
}
