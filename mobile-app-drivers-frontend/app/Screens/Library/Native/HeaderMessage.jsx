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

export default class HeaderMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      title,
      _callback,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="message"
            size={Icons.medium}
            color={Colors.white}
            onPress={() => _callback()}
          />
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Text style={{ color: Colors.white, fontSize: Font.title_3 }}>
              {title}
            </Text>
          </View>
          <Image
            style={styles.image}
            source={headerImage}
          />
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    height: Logo.medium,
    width: Logo.large,
    paddingTop: 10,
  },
});
