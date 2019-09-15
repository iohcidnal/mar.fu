import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import NavigationLoader from './NavigationLoader';
import Login from '../login';
import SignUp from '../sign-up';
import { MedicationGroups, MedicationGroupForm } from '../medication-groups';
import { Medications, MedicationForm } from '../medications';

const LoginNavigator = createStackNavigator({ Login });
const SignUpNavigator = createStackNavigator({ SignUp });
const MedicationGroupsNavigator = createStackNavigator({ MedicationGroups, MedicationGroupForm, Medications, MedicationForm });

export default createAppContainer(
  createSwitchNavigator(
    {
      NavigationLoader,
      Login: LoginNavigator,
      SignUp: SignUpNavigator,
      MedicationGroups: MedicationGroupsNavigator,
    },
    {
      initialRouteName: 'NavigationLoader'
    }
  )
);
