import Constants from 'expo-constants';

// Replace values with your settings from
// https://console.firebase.google.com/project/(your-project-id)/settings/cloudmessaging
const dbConfig = {
  dev: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  }
};

export function getDbConfig(releaseChannel) {
  // since releaseChannels are undefined in dev, return dev config
  if (!releaseChannel) return dbConfig.dev;

  const config = dbConfig[releaseChannel];
  if (!config) throw Error(`No config found for ${releaseChannel}.`);

  return config;
}

// Expo.Constants.manifest.releaseChannel does NOT exist in dev mode.
// It does exist, however when we explicitly publish / build with it
export default getDbConfig(Constants.manifest.releaseChannel);
