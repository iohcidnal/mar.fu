import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from '../login';
import SignUp from '../sign-up';

const LoginNavigator = createStackNavigator({
  Login
});

const SignUpNavigator = createStackNavigator({
  SignUp
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login: LoginNavigator,
    SignUp: SignUpNavigator,
  })
);
