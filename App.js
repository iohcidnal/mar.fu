import React from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Root } from 'native-base';

import AppNavigation from './src/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);

  async function handleLoadResourceAsync() {
    return Promise.all([
      // TODO: load assets for splash screen
      Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      }),
    ]);
  }

  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={handleLoadResourceAsync}
        onFinish={() => setIsLoadingComplete(true)}
        onError={error => console.warn(error)}
      />
    );
  }

  return (
    <Root>
      <View style={styles.container}>
        <ActionSheetProvider>
          <AppNavigation />
        </ActionSheetProvider>
      </View>
    </Root>
  );
}
