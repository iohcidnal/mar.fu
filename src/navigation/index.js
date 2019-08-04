import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import NavigationLoader from './NavigationLoader';
import Login from '../login';
import SignUp from '../sign-up';
import { MyMeds, RecordForm } from '../my-meds';

const LoginNavigator = createStackNavigator({ Login });
const SignUpNavigator = createStackNavigator({ SignUp });
const MyMedsNavigator = createStackNavigator({ MyMeds, RecordForm });

export default createAppContainer(
  createSwitchNavigator(
    {
      NavigationLoader,
      Login: LoginNavigator,
      SignUp: SignUpNavigator,
      MyMeds: MyMedsNavigator,
    },
    {
      initialRouteName: 'NavigationLoader'
    }
  )
);
