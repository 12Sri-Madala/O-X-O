/*
This file contains the formatting information for the Sidebar Menu.
It also sets the navigation for each item in the Sidebar Menu.
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, Text, View, Image, AsyncStorage, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {Icon } from 'react-native-elements';
import {Colors, Spacing, Icons, Font} from '../../Library/Native/StyleGuide';

export default class DrawerContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: "",
    };
  }

  async logout() {
    await AsyncStorage.removeItem('id');
    // await AsyncStorage.removeItem('token');
    // await AsyncStorage.removeItem('firstName');
    // await AsyncStorage.removeItem('lastName');
    // await AsyncStorage.removeItem('profileImage');
    // await AsyncStorage.removeItem('checkr');
    // await AsyncStorage.removeItem('license');
    // await AsyncStorage.removeItem('email');
    this.props.navigation.navigate('WelcomeScreen')
  }

  async componentDidMount(){
    let firstName = await this.getItem("firstName")
    let lastName = await this.getItem("lastName")
    this.setState({
      name: firstName + " " + lastName,
    })
  }

  async getItem(key) {
    try {
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        var jsonOfItem = await AsyncStorage.getItem(key);
        return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  dashboardClose(){
    this.props.navigation.navigate('Dashboard')
    this.props.navigation.closeDrawer()
  }

  render() {
    const { navigation } = this.props
    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always'}}
      >
        <View style={styles.topBar}>
          <Icon name="close" size={Icons.medium} color={Colors.white} onPress={() => navigation.closeDrawer()}/>
        </View>
        <View style={styles.header}>
          <TouchableHighlight onPress={() => navigation.navigate('ProfilePage')}>
            <Image style={styles.userImage} source={require('../../../Resources/whiteLogo.png')}/>
          </TouchableHighlight>
          <Text style={styles.headerText}>
            {this.state.name}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <Text
            onPress={() => this.dashboardClose()}
            style={styles.DrawerItem}>
            Dashboard
          </Text>
          <Text
            onPress={() => navigation.navigate('Payment')}
            style={styles.DrawerItem}>
            Payment
          </Text>
          <Text
            onPress={() => navigation.navigate('FAQ')}
            style={styles.DrawerItem}>
            FAQ
          </Text>
          <Text
            onPress={() => navigation.navigate('ProfilePage')}
            style={styles.DrawerItem}>
            Settings
          </Text>
          <Text
            onPress={() => this.logout()}
            style={styles.DrawerItem}>
            Log Out
          </Text>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderWidth: Spacing.lineWidth,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    backgroundColor: Colors.primary,
    alignItems: 'flex-end',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  userImage: {
    width: 1.5*Icons.x_large,
    height: 1.5*Icons.x_large,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: Font.title_3,
    color: Colors.white,
    textAlign: 'center',
    margin: Spacing.tiny,
  },
  DrawerItem: {
    fontSize: Font.title_2,
    color: Colors.primary,
    margin: Spacing.small,
    textAlign: 'center',
  }
})
