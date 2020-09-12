// Import components from React and React Native
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Import local components
import { Colors, Spacing } from '../../Library/Native/StyleGuide.js';

export default class LoginTitle extends React.Component {
    render() {
        return (
            <View style= {styles.messageContainer}>
                <Text style={styles.message}>{this.props.message}</Text>
            </View>
        );
  }
}

const styles = StyleSheet.create({
    messageContainer:{
      flex: 0,
      width: '100%',
      justifyContent: 'flex-start',
    },
    message: {
        color: Colors.white,
    },
});
