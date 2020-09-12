/* Single profileField component. Container for first name, last name,
   bio, locations, and background check.
   By: Zac Espinosa
*/
// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Import elements from separate Node modules
import {Icon} from 'react-native-elements';
import { Colors, Spacing, Icons, Font } from '../../Library/Native/StyleGuide';

export default class ProfileField extends React.Component {

  render() {
    return(
      <TouchableOpacity
        style={styles.fieldContainer}
        onPress={() => this.props.handlePress()}
        >
        <View style={styles.textContainer}>
          <Text style={styles.fieldtitle}>{this.props.field}</Text>
          <Text style={styles.fieldvalue}>{this.props.fieldValue}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon name={this.props.icon} size={Icons.medium} color={this.props.iconColor} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    flex: 0,
    justifyContent: 'center',
    marginRight: Spacing.tiny,
  },
  fieldtitle: {
    fontSize: Font.regular,
    color: Colors.white,
    margin: Spacing.tiny,
    marginLeft: Spacing.small,
  },
  fieldvalue: {
    fontSize: Font.large,
    color: Colors.white,
    margin: Spacing.tiny,
    marginLeft: Spacing.small,
  },
  textContainer: {
    width: '90%',
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    backgroundColor: Colors.primary,
    borderBottomColor: Colors.white,
    borderBottomWidth: Spacing.lineWidth,
    marginTop: Spacing.lineWidth,
  },
});
