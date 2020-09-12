/*
This page loads the driver's payment information (i.e. credit cards) and
allows them to change the default card as well as link to NewCardPage
where they can add additional payment methods
*/

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
  import withErrorHandling from '../../../../Containers/Native/withErrorHandling';

  // Import Style Guide and Language Guide
  import { Colors, Font, Spacing, Icons } from '../../../Library/Native/StyleGuide.js';

  // Import Redux Actions
  import {
    loadVehicles
  } from '../Redux/actions.js';
  import {saveLicense, saveVehicle} from "../Redux/actions";

  class VehiclesList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        id: null,
        token: null,
        index: null
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
      this.props.dispatchLoadVehicles(id, token);
      this.setState({index: this.props.navigation.getParam('index', null)})
    }

    async editImage() {
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      let result;
      Alert.alert(
        'Select picture of your car',
        '',
        [
          {
            text: 'Photo Library', onPress: async () => {
              result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 0.1,
                base64: true,
              });
              if (!result.cancelled) {
                await this.props.dispatchSaveLicense({vehicleImage: 'data:image/png;base64,' + result.base64}, this.state.index);
              }
            }
          },
          {
            text: 'Camera', onPress: async () => {
              result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.1,
                base64: true,
              });
              if (!result.cancelled) {
                await this.props.dispatchSaveLicense({vehicleImage: 'data:image/png;base64,' + result.base64}, this.state.index);
              }
            }
          },
          {
            text: 'Cancel', style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }

    getVehiclePicture() {
      if (this.props.vehicles[this.state.index] && this.props.vehicles[this.state.index].vehicleImage) {
        return(
          <View>
          <Image style={styles.image} resizeMode={'cover'} source={{uri: this.props.vehicles[this.state.index].vehicleImage}}/>
          <Icon
            reverse
            name="edit"
            size={Icons.small}
            color={Colors.secondary}
            containerStyle={{position: "absolute", bottom: -Spacing.tiny, right: -Spacing.tiny}}
            raised={true}
            reverseColor={Colors.white}
            onPress={() => this.editImage()}
          />
          </View>

        );
      } else {
        return(
          <View>
          <Icon name={'directions-car'} containerStyle={styles.image} size={Icons.huge} color={Colors.primary}/>
          <Icon
            reverse
            name="edit"
            size={Icons.small}
            color={Colors.secondary}
            containerStyle={{position: "absolute", bottom: -10, right: -10}}
            raised={true}
            reverseColor={Colors.white}
            onPress={() => this.editImage()}
          />
          </View>
        )
      }
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
        {this.state.id && this.state.token && <NavigationEvents
          onWillFocus={payload => this.props.dispatchLoadVehicles(this.state.id, this.state.token)}
          />}
          <View style={{width: '100%', height: '11%'}}>
          <Header
            icon='chevron-left'
            title= {"Vehicle details"}
            _callback={() => this.props.navigation.navigate('VehiclesList')}
            _call={() => {
            this.props.navigation.navigate('Dashboard');
          }}/>
          </View>
          {this.props.vehicles[this.state.index] &&
            <View style={{flex: 6, width: '100%'}}>
            <ScrollView style={styles.container}>
            <View style={styles.carInfo}>
            {this.getVehiclePicture()}
            <View style={{justifyContent: 'center'}}>
            <Text style={styles.cardInfo}>
            {this.props.vehicles[this.state.index].make + ' ' + this.props.vehicles[this.state.index].model}
            </Text>
            <Text style={styles.cardInfo}>
            {this.props.vehicles[this.state.index].plateNumber}
            </Text>
            <Text style={styles.cardInfo}>
            {this.props.vehicles[this.state.index].year}
            </Text>
            </View>
            </View>
            <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => this.props.navigation.navigate('VehicleDetails', {index: this.state.index, before: 'VehicleInfo'})}
            >
            <Text style={styles.cardInfo}>
            {'Details'}
            </Text>
            {this.props.vehicles[this.state.index].plateNumber && this.props.vehicles[this.state.index].vin && this.props.vehicles[this.state.index].licenseState ?
              <Icon name={'check-circle'} size={Icons.medium} color={Colors.primary}/> :
              <Icon name={'error'} size={Icons.medium} color={Colors.secondary}/>
            }
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => this.props.navigation.navigate('Inspection', {index: this.state.index})}
            >
            <Text style={styles.cardInfo}>
            {'Inspection'}
            </Text>
            {this.props.vehicles[this.state.index].approved ?
              <Icon
                name={'check-circle'}
                size={Icons.medium}
                color={Colors.primary}/>
                 : (this.props.vehicles[this.state.index].inspectionImage ?
              <Icon
                name={'watch-later'}
                size={Icons.medium}
                color={Colors.secondary}/> :
              <Icon
                name={'error'}
                size={Icons.medium}
                color={Colors.secondary}/>)
              }
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.navigation.navigate('Insurance', {index: this.state.index})}
              >
              <Text style={styles.cardInfo}>
              {'Insurance'}
              </Text>
              {this.props.vehicles[this.state.index].approved ?
              <Icon
                name={'check-circle'}
                size={Icons.medium}
                color={Colors.primary}/>
                 : (this.props.vehicles[this.state.index].insuranceImage ?
                <Icon
                  name={'watch-later'}
                  size={Icons.medium}
                  color={Colors.secondary}/> :
                  <Icon
                  name={'error'}
                  size={Icons.medium}
                  color={Colors.secondary}/>)
                }
                </TouchableOpacity>
                </ScrollView>
                </View>}
                </View>
              );
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
                vehicles: state.vehicles.vehicles
              }
            }

            const mapDispatchToProps = dispatch => {
              return {
                dispatchLoadVehicles: (id, token) => dispatch(loadVehicles(id, token)),
                dispatchSaveLicense: (vehicle, id) => {dispatch(saveLicense(vehicle, null, id)) }
              }
            }

            export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(VehiclesList));

            const styles = StyleSheet.create({
              container: {
                backgroundColor: Colors.white,
                width: "90%",
                marginLeft: '5%',
              },
              carInfo: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: Spacing.small
              },
              image: {
                overflow: 'hidden',
                borderColor: Colors.primary,
                borderWidth: Spacing.lineWidth,
                borderRadius: 130/2,
                width: 130,
                height: 130,
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
              }
            });
