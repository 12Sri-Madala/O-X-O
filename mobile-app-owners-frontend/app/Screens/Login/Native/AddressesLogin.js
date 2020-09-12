/* This is the fourth screen that new users see. It captures
   their first name, last name, and an optional profile picture.
   This screen also needs to integrate with firebase in order
   to create user profiles.
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';

// Import elements from separate Node modules
import { connect } from 'react-redux';
import validator from 'validator';

// Import local components
import LoginHeader from './LoginHeader';
import LoginTitle from './LoginTitle';
import Input from '../../Library/Native/LoginInput.js';
import ButtonLeft from '../../Library/Native/ButtonLeft.js';
import LoginMessage from './LoginMessage.js';
import Loader from '../../Library/Native/Loader.js';
import { Colors, Spacing } from '../../Library/Native/StyleGuide.js';
import GooglePlacesAutocomplete from '../../Library/Native/GooglePlaces.js';
import { saveAddress } from '../Redux/actions.js';

class AddressesLogin extends React.Component {
  constructor() {
    super();
    this.state = {
        homeAddress: null,
        workAddress:null,
        opacity: Colors.touchedOpacity,
        buttonColor: Colors.disabled,
        displayHomeLabel: false,
        displayWorkLabel: false,
        complete: false,
    };
    this.saveHomeAddress = this.saveHomeAddress.bind(this);
    this.saveWorkAddress = this.saveWorkAddress.bind(this);
    this.skipScreen = this.skipScreen.bind(this);
    this.goBack = this.goBack.bind(this);
    this.submitAddressInfo = this.submitAddressInfo.bind(this);
  }

  async submitAddressInfo() {
    const token = await AsyncStorage.getItem('token');
    const id = await AsyncStorage.getItem('id');
    console.log(token);
    const nav = () => this.props.navigation.navigate('Dashboard');
    const req = {
        id: id,
        token: token,
        payload: {
          homeAddress: this.state.homeAddress,
          workAddress: this.state.workAddress,
        }
    }
    this.props.dispatchSaveAddress(req, nav);
  }

  checkUserComplete() {
    if (this.state.homeAddress !== null && this.state.workAddress !== null) {
        this.setState({
            buttonColor: Colors.secondary,
            opacity: 1,
            complete: true,
        });
    } else {
        this.setState({
            complete: false,
            opacity: Colors.touchedOpacity,
            buttonColor: Colors.disabled,
        });
    }
  }

  async saveHomeAddress(value) {
      await this.setState({
          homeAddress: value,
          displayHomeLabel: true,
      });
      this.checkUserComplete();
  }

  async saveWorkAddress(value) {
      await this.setState({
          workAddress: value,
          displayWorkLabel: true
      });
      this.checkUserComplete();
  }

  skipScreen() {
    this.props.navigation.navigate('Dashboard');
  }

  goBack() {
    this.props.navigation.navigate('ProfileImage');
  }

  render() {
    return (
        <View style={styles.screenContainer}>
          <LoginHeader
            cornerText='SKIP'
            _rightCallback={this.skipScreen}
            _leftCallback={this.goBack}
            icon='chevron-left'/>
          <LoginTitle title="Tell us about your commute"></LoginTitle>
          <View style={styles.googleContainer}>
          <GooglePlacesAutocomplete
            placeholderTextColor = {Colors.light}
            maincolor= {Colors.primary}
            secondarycolor= {Colors.white}
            placeholder="Home address"
            displayLabel={this.state.displayHomeLabel}
            label="HOME ADDRESS"
            onSubmitEditing= {{ onSubmitEditing: (data, details) => { this.saveHomeAddress(data.nativeEvent.text), data =null}
          }}
            onPress={(data, details) => { this.saveHomeAddress(data.description), data =null}}>
          </GooglePlacesAutocomplete>
          <GooglePlacesAutocomplete
              placeholderTextColor = {Colors.light}
              maincolor= {Colors.primary}
              secondarycolor= {Colors.white}
              placeholder="Work address"
              onSubmitEditing= {{ onSubmitEditing: (data, details) => { this.saveWorkAddress(data.nativeEvent.text), data =null}}}
              onPress={(data, details) => {this.saveWorkAddress(data.description), data =null}}>
            </GooglePlacesAutocomplete>
              </View>
        <ButtonLeft
          opacity={this.state.opacity}
          color={this.state.buttonColor}
          _callBack={ this.state.complete ? this.submitAddressInfo : () => {} }
          icon='chevron-right'
          title='NEXT'
          relative={true}>
        </ButtonLeft>
        </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        addresses: state.login.addresses,
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      dispatchSaveAddress: (address, nav) => { dispatch(saveAddress(address, nav)) } ,
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(AddressesLogin);

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: Spacing.small,
        paddingRight: Spacing.small,
        backgroundColor: Colors.primary,
    },
    googleContainer: {
        flex:1,
        alignItems: 'center',
        backgroundColor: Colors.primary,
    },
});
