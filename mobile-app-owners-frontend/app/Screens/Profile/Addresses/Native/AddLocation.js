import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    AsyncStorage,
    Keyboard,
    Dimensions
} from 'react-native';
import { StackActions } from 'react-navigation';
import { connect } from 'react-redux';

// Import local components
import Header from '../../../Library/Native/Header';
import LoginTitle from '../../../Login/Native/LoginTitle';
import EditInput from '../../../Library/Native/EditInput.js';
import Loader from '../../../Library/Native/Loader';
import OxoButton from '../../../Library/Native/OxoButton.js';
import ButtonLeft from '../../../Library/Native/ButtonLeft.js';
import GooglePlacesAutocomplete from '../../../Library/Native/GooglePlaces.js';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../../Library/Native/StyleGuide.js';
import { Payments } from '../../../Library/Native/LanguageGuide.js';

import {saveAddress} from '../Redux/actions.js'
import {loadAddresses} from '../Redux/actions.js'

import {Input} from "react-native-elements";



class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        label: null,
        newaddress: null,
        opacity: Colors.touchedOpacity,
        buttonColor: Colors.secondary,
        displayNewLabel: null,
        bottomPad:0,
        complete: null,
      };
      this.saveNewAddress= this.saveNewAddress.bind(this);
      this.saveAddressLabel= this.saveAddressLabel.bind(this);
      this.submitAddressInfo = this.submitAddressInfo.bind(this);
    }

    async submitAddressInfo() {
      const token = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem('id');
      this.props.dispatchLoadAddresses(id, token);
      let name= this.state.label;
      this.props.addresses[name] = this.state.newAddress;
      let req = {
          id: id,
          token: token,
          payload: this.props.addresses
      }
      this.props.dispatchSaveAddress(req);
      this.props.navigation.navigate('LocationList');
    }

    checkUserComplete() {
      if (this.state.newAddress !== null && this.state.label !== null) {
          this.setState({
              opacity: 1,
              complete: true,
          });
      } else {
          this.setState({
              complete: false,
              opacity: Colors.touchedOpacity,
          });
      }
    }

    saveAddressLabel(value) {
        this.setState({
            label: value,
            displayNewLabel: true,
        });
        this.checkUserComplete();
    }

    backNavigate(lastLoc){
      if(lastLoc === "Dashboard"){
        this.props.navigation.dispatch(StackActions.popToTop());
      }
      this.props.navigation.navigate(lastLoc)
    }

    async saveNewAddress(value) {
      await this.setState({
            newAddress: value,
        });
        this.checkUserComplete();
    }

    render() {
      const prevLoc = this.props.navigation.getParam('prevLoc')
      console.log("previous location from AddLocation", prevLoc)

        return (
          <View style={styles.screenContainer}>
            <View style={{height:'11%', width: '100%'}}>
                <Header
                  icon='chevron-left'
                  title='Add Location'
                  _callback={() => this.backNavigate(prevLoc)} 
                />
            </View>
            <ScrollView style={styles.container}>
             <View style= {styles.inputContainer}>
            <EditInput
           errorMessage={'Required'}
           hideError={this.props.emptyFirstName}
           placeholderTextColor = {Colors.light}
           selectionColor={Colors.primary}
           labelStyle={styles.labelText}
           inputStyle={styles.valueText}
           placeholder="Enter address label"
           displayLabel={this.state.displayNewLabel}
           label='Address Label'
           onChangeText={this.saveAddressLabel}>
           </EditInput>
           </View>
           <View style= {styles.googleContainer}>
           <GooglePlacesAutocomplete
           placeholderTextColor = {Colors.light}
           maincolor= {Colors.white}
           secondarycolor= {Colors.primary}
           bordercolor={Colors.light}
           placeholder="New address"
           onSubmitEditing= {{ onSubmitEditing: (data, details) => { this.saveNewAddress(data.nativeEvent.text), data =null}}}
           onPress={(data, details) => {this.saveNewAddress(data.description), data =null}}>
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

        {/*<View style={{height: this.state.bottomPad}}/>*/}
           </ScrollView>
           </View>
         );
}
}
const mapStateToProps = state => {
    // console.log(state);
    return {
        addresses: state.addresses.addresses,
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      dispatchLoadAddresses: (id, token) => dispatch(loadAddresses(id, token)),
      dispatchSaveAddress: (address, nav) => { dispatch(saveAddress(address, nav)) } ,

    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);

const styles = StyleSheet.create({
  labelText: {
      fontSize: Font.regular,
      color: Colors.primary,
      paddingVertical: Spacing.tiny,
  },
  valueText: {
      width: '100%',
      fontSize: Font.title_3,
      color: Colors.primary,

  },
  container: {
          backgroundColor: Colors.white,
          width: "100%",
      },
    screenContainer: {
        height:'100%',
        width: '100%',
        alignItems: 'flex-start',
        backgroundColor: Colors.white,
    },
    googleContainer: {
        flex:1,
        alignItems: 'flex-start',
        paddingLeft: Spacing.base,
        paddingRight: Spacing.base,
        backgroundColor: Colors.white,
    },
    inputContainer: {
        flex:1,
        paddingLeft: Spacing.tiny,
        paddingRight: Spacing.tiny,
        alignItems: 'flex-start',
        backgroundColor: Colors.white,
    },
});
