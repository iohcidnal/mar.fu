import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import NavigationLoader from './NavigationLoader';
import Login from '../login';
import SignUp from '../sign-up';
import { MedicationGroups, MedicationGroupForm, MedicationGroupShare } from '../medication-groups';
import { Medications, MedicationForm, MedicationLogs } from '../medications';

const LoginNavigator = createStackNavigator({ Login });
const SignUpNavigator = createStackNavigator({ SignUp });
const MedicationGroupsNavigator = createStackNavigator({ MedicationGroups, MedicationGroupForm, MedicationGroupShare, Medications, MedicationForm, MedicationLogs });

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
