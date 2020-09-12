import React from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import { Colors, Font, Spacing } from '../../Library/Native/StyleGuide';

import Header from '../../../Screens/Library/Native/Header';
import errorScreens from '../Resources/errorImages';

class GenericError extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <Image style={styles.image} source={errorScreens.error1}></Image>
          <Text style={styles.title}>Whoops! Something went wrong on our end...</Text>
          <Text style={styles.title}>Try reloading the app.</Text>
        </View>);
      }
    }

    export default GenericError;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: '100%',
        backgroundColor: Colors.primary,
        color: Colors.white,
      },
      image: {
        flex:1,
        resizeMode: 'contain',
        marginTop: Spacing.large,
        marginBottom: Spacing.base,
        marginRight: Spacing.base,
        marginLeft: Spacing.base,
      },
      headers: {
        flex: 1,
        width: '100%'
      },
      title: {
        textAlign: 'center',
        margin: '5%',
        color: Colors.white,
        fontSize: Font.title_3,
      },
    });
