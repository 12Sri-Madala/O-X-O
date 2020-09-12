/*
Renders a customizeable blue header with an user specified icon on the left,
user specified title in the center, and OXO logo on the right.
Accepted Props:
icon - name of icon, string
title - title of page, string
_callback - function called when icon is pressed
*/

// Import components from React and React Native
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

// Import elements from separate Node modules
import { Icon } from 'react-native-elements';

import {
  Spacing,
  Colors,
  Font,
  Icons,
  Logo,
} from './StyleGuide';

const headerImage = require('../../../Resources/whiteLogo.png');

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      icon,
      _callback,
      unread,
      title,
      _call,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Icon
              name={icon}
              size={Icons.medium}
              color={Colors.white}
              onPress={() => _callback()}
            />
            {unread && (
              <View style={{
                ...StyleSheet.flatten(styles.dot),
                backgroundColor: Colors.secondary
              }}
              />
            )}
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.title}>
              {title}
            </Text>
          </View>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
            onPress={() => _call()}
          >
            <Image
              style={styles.image}
              source={headerImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: Colors.primary,
  },
  title: {
    color: Colors.white,
    fontSize: Font.title_3,
    textAlign: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    resizeMode: 'contain',
    height: Logo.medium,
    width: Logo.large,
    paddingTop: Spacing.tiny,
  },
  dot: {
    height: Spacing.tiny,
    width: Spacing.tiny,
    position: 'absolute',
    // Need to test out these hard coded pixel offsets
    left: Font.title_2,
    borderRadius: Logo.medium,
    zIndex: 100,
  },
});
