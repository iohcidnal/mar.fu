import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Icon, Text } from 'native-base';

const styles = {
  root: {
    alignItems: 'center',
    backgroundColor: '#007aff',
    paddingTop: 30,
    paddingBottom: 30,
    marginBottom: 10,
  },
  icon: {
    fontSize: 54,
    color: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    color: '#FFF',
  },
};

export default function Banner({ iconName, iconType = 'Ionicons', title, description }) {
  return (
    <View style={styles.root}>
      {iconName && <Icon name={iconName} type={iconType} style={styles.icon} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

Banner.propTypes = {
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};
