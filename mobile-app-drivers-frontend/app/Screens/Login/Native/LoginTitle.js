// Import components from React and React Native
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Import local components
import { Colors, Font } from '../../Library/Native/StyleGuide';

export default class LoginTitle extends React.Component {
    render() {
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        );
  }
}

const styles = StyleSheet.create({
    titleContainer: {
      flex: 0.15,
      width: '100%',
      justifyContent: 'flex-start',
    },
    title: {
      color: Colors.white,
      fontSize: Font.title_3,
    },
  });
