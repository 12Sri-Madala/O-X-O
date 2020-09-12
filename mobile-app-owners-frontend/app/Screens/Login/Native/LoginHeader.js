/*
Renders a customizeable blue header with an user specified icon on the left,
user specified title in the center, and OXO logo on the right.
*/

// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Import elements from separate Node modules
import {Icon} from 'react-native-elements';

// Import local Components
import { Spacing, Colors, Icons, Font } from '../../Library/Native/StyleGuide.js';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return(
        <View style={{height: Spacing[this.props.height], ...StyleSheet.flatten(styles.header)}}>
          <TouchableOpacity onPress={() => this.props._leftCallback ? this.props._leftCallback() : null }>
						<Icon
							name={this.props.icon}
              size={Icons.medium}
              color={Colors.white}
							containerStyle={styles.icon}
						/>
					</TouchableOpacity>
          <Text style={styles.text}>
            {this.props.title}
          </Text>
          <Text onPress={this.props._rightCallback ? this.props._rightCallback : () => {}} style={styles.text}>{this.props.cornerText ? this.props.cornerText : ""}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontSize: Font.large
  },
	icon: {
		marginLeft: -12 // hard coded, bad solution for now, change later
	},
  header: {
      paddingTop: Spacing.base,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.primary,
    },
});
