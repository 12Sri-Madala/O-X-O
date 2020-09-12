// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, ScrollView, ImageBackground, StatusBar, Button, Image, TouchableOpacity, TouchableHighlight,
    FlatList, Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

// Import local components
import Header from '../../../Library/Native/Header';
import Loader from '../../../Library/Native/Loader';
import OxoButton from '../../../Library/Native/OxoButton.js';
import GooglePlacesAutocomplete from '../../../Library/Native/GooglePlaces.js';
import withErrorHandling from '../../../../Containers/Native/withErrorHandling';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../../Library/Native/StyleGuide.js';

// Import Redux Actions
import {saveAddress} from '../Redux/actions.js'
import {loadAddresses} from '../Redux/actions.js'


class LocationInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name:null,
            id: null,
            token: null,
        }
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

    async componentDidMount(){
        const token = await this.getItem('token');
        const id = await this.getItem('id');
        await this.setState({
            id: id,
            token: token,
        });
        this.props.dispatchLoadAddresses(id, token)
        this.setState({name: this.props.navigation.getParam('name', null)})
    }

 saveAddressInfo(value){
     this.props.addresses[this.state.name]= value;
    }
    async submitAddressInfo() {
      let req = {
          id: this.state.id,
          token: this.state.token,
          payload: this.props.addresses
      }
      await this.props.dispatchSaveAddress(req, nav);
      const nav = this.props.navigation.navigate('LocationList');
    }

    async deleteAddress(){
      delete this.props.addresses[this.state.name];
      this.submitAddressInfo();

    }
    /*
    Description: Render the card items in the ScrollView as TouchableOpacities which can update the default card
    Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
               index => index in the list of this specific item
    Returns: N/A
    */

    render() {
        return (
            <View style={{backgroundColor: Colors.white, height:'100%'}}>
                <View style={{width: '100%', height: '11%'}}>
                    <Header
                        icon='chevron-left'
                        title= {"Vehicles"}
                        _callback={() => this.props.navigation.navigate('LocationList')}
                        _call={() => {
                            this.props.navigation.navigate('Dashboard');
                        }}/>
                </View>
                {this.props.addresses &&
                <View style={{flex: 6, width: '100%'}}>
                    <ScrollView style={styles.container}>
                    <View style= {styles.carInfo}>
                        {this.state.name === 'homeAddress' ?
                          <Icon
                          name = {'home'}
                          containerStyle={styles.image}
                          size={Icons.large}
                          color={Colors.primary}
                          />
                          :
                          this.state.name === 'workAddress' ?
                          <Icon
                          name = {'work'}
                          containerStyle={styles.image}
                          size={Icons.large}
                          color={Colors.primary}/>
                          :
                          <Icon
                          name = {'location-on'}
                          containerStyle={styles.image}
                          size={Icons.large}
                          color={Colors.primary}/>
                          }
                        <View style={{justifyContent: 'center'}}>
                            {this.state.name === 'homeAddress' ?
                            <Text style={styles.cardInfo}>
                                {'Home address'}
                            </Text>
                              :
                              this.state.name === 'workAddress' ?
                              <Text style={styles.cardInfo}>
                                  {'Work address'}
                              </Text>
                              :
                              <Text style={styles.cardInfo}>
                                {this.state.name}
                              </Text>
                              }
                            </View>
                            </View>
                        <View style= {styles.googleContainer}>
                        <GooglePlacesAutocomplete
                        placeholderTextColor = {Colors.light}
                        maincolor= {Colors.white}
                        secondarycolor= {Colors.primary}
                        placeholder={this.props.addresses[this.state.name]}
                        onSubmitEditing= {{ onSubmitEditing: (data, details) => { this.saveAddressInfo(data.nativeEvent.text), data =null}}}
                        onPress={(data, details) => {this.saveAddressInfo(data.description), data =null}}>
                        </GooglePlacesAutocomplete>
                        </View>
                        <View style={styles.buttons}>
                        <OxoButton
                          type={'outline'}
                          buttonSize={'large'}
                          fontSize={'large'}
                          content={'Save'}
                          color={'primary'}
                          onPress={() => this.submitAddressInfo()}
                          />
                          <OxoButton
                            type={'outline'}
                            buttonSize={'large'}
                            fontSize={'large'}
                            content={'Delete'}
                            color={'secondary'}
                            onPress={() => this.deleteAddress()}
                            />
                          </View>
                    </ScrollView>
                </View>
      }
          </View>
    )
  }
}


{/*<TouchableOpacity
  style={styles.touchableContainer}
  onPress={() => this.props.dispatchMakePayment({ amount: 100, currency: 'usd',
                                                customerID: this.props.customerID, description: 'Test $1 charge'})}
>
  <Text style={{color: '#005BC2', fontSize: 20}}>Donate $1</Text>
</TouchableOpacity>*/}


const mapStateToProps = state => {
    return {
      addresses: state.addresses.addresses

    }
}

const mapDispatchToProps = dispatch => {
    return {
      dispatchLoadAddresses: (id, token) => dispatch(loadAddresses(id, token)),
      dispatchSaveAddress: (address, nav) => { dispatch(saveAddress(address, nav)) } ,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(LocationInfo));

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        width: "90%",
        marginLeft: '5%',
    },
    carInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.small
    },
    image: {
        overflow: 'hidden',
        marginRight: Spacing.small,
    },
    title: {
        fontSize: Font.title_3,
        color: Colors.primary,
        textAlign: 'left',
        margin: Spacing.base,
    },
    touchableContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        marginTop: Spacing.small,
    },
    cardInfo: {
        fontSize: Font.title_3,
        color: Colors.primary,
    },
    missingInfo: {
        fontSize: Font.small,
        marginLeft: Spacing.small,
        color: Colors.secondary,
    },
    checkContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.small,
        paddingBottom: Spacing.tiny,
        borderColor: Colors.primary,
        borderBottomWidth: Spacing.lineWidth,
    },
    buttons: {
      marginTop: Spacing.base,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    googleContainer: {
        marginHorizontal: Spacing.tiny
    }
  });
