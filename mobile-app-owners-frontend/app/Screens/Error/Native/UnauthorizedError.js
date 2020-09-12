import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  AsyncStorage,
} from 'react-native';
import { Colors, Font, Spacing } from '../../Library/Native/StyleGuide';
import OxoButton from '../../Library/Native/OxoButton.js';
import { connect } from 'react-redux';

import Header from '../../../Screens/Library/Native/Header';
import errorScreens from '../Resources/errorImages';

class UnauthorizedError extends React.Component {

  constructor(props){
    console.log(props)
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout(){
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('id');
    this.props.dispatchLogout();
    this.props.navigation.navigate('WelcomeScreen');
  }

  render() {
    return (
      <View style={styles.container}>
          <Image style={styles.image} source={errorScreens.error1}></Image>
          <OxoButton
          type='contained'
          buttonSize='large'
          fontSize='large'
          color='secondary'
          content='Logout'
          onPress={this.handleLogout}
          />
          <Text style={styles.title}>Hmm, it looks like you're not logged in. Please log out and try again.</Text>
        </View>);
      }
    }

    const mapDispatchToProps = dispatch => {
      return {
        dispatchLogout: () => dispatch({type: 'USER_LOGOUT'}),
      }
    }

    export default connect(null, mapDispatchToProps)(UnauthorizedError);

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
        marginBottom: '10%',
        color: Colors.white,
        fontSize: Font.title_3,
      },
    });
