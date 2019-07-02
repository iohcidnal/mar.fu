import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Login from '../login';

const LoginNavigator = createStackNavigator({
  Login
});

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login: LoginNavigator,
  })
);
