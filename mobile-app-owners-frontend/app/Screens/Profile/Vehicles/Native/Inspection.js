/*
This page loads the driver's payment information (i.e. credit cards) and
allows them to change the default card as well as link to NewCardPage
where they can add additional payment methods
*/
import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, ImageBackground, StatusBar, Button, Image, TouchableOpacity, TouchableHighlight,
  FlatList, Alert, AsyncStorage, Linking, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';

// Import local components
import Header from '../../../Library/Native/Header';
import Loader from '../../../Library/Native/Loader';
import OxoButton from '../../../Library/Native/OxoButton.js';
import withErrorHandling from '../../../../Containers/Native/withErrorHandling';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../../Library/Native/StyleGuide.js';

// Import Redux Actions
import {
  saveLicense, loadVehicles
} from '../Redux/actions.js';

class Inspection extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      opacity: Colors.touchedOpacity,
      buttonColor: Colors.disabled,
      uri: null,
      base64: null,
      index: null,
    }
    this.editImage = this.editImage.bind(this);
  }

  async componentDidMount(){
    const token = await AsyncStorage.getItem('token');
    const id = await AsyncStorage.getItem('id');
    this.setState({
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
      'Select photo of inspection form',
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
              await this.props.dispatchSaveLicense({inspectionImage: 'data:image/png;base64,' + result.base64}, this.state.index);
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
              await this.props.dispatchSaveLicense({inspectionImage: 'data:image/png;base64,' + result.base64}, this.state.index);
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


  render() {
    return (
      <View style={{backgroundColor: Colors.white, height:'100%'}}>
      <View style={{width: '100%', height: '11%'}}>
      <Header
        icon='chevron-left'
        title= {"Inspection"}
        _callback={() => this.props.navigation.navigate('VehicleInfo')}
        _call={() => {
        this.props.navigation.navigate('Dashboard');
      }}/>
      </View>
      <ScrollView style={styles.container} >
      <Text style={styles.title}>{'Upload inspection photo'}</Text>
      {this.props.vehicles[this.state.index] &&
        <View style={{flex: 6, width: '100%', marginTop: Spacing.small}}>
        {this.props.vehicles[this.state.index].inspectionImage && (!this.props.vehicles[this.state.index].approved) ?
          <Text style={styles.pendingApproval}>
          Thanks for uploading your photo! OXO is reviewing it now and you'll get an alert when we're done. We'll get back within 48 hours.
          </Text> : <View/>
        }
        <View style={{alignItems: 'center', margin: Spacing.base}}>

        {this.props.vehicles[this.state.index].inspectionImage ?
          <ImageBackground
          source={{uri: this.props.vehicles[this.state.index].inspectionImage}}
          resizeMode={'center'}
          style={styles.images}
          >
          <Icon
            reverse
            name="edit"
            size={Icons.small}
            color={Colors.secondary}
            containerStyle={{position: "absolute", bottom: -Spacing.small, right: -Spacing.small}}
            raised={true}
            reverseColor={Colors.white}
            onPress={() => this.editImage()}
          />
          </ImageBackground> :
          <OxoButton
            type={'outline'}
            buttonSize={'x_large'}
            fontSize={'large'}
            content={''}
            color={'secondary'}
            icon= 'camera-alt'
            iconLocation= 'left'
            onPress={() => this.editImage()}/>
        }
        </View>
        <Text style={styles.question}>
        In order to drive for Lyft/Uber, your car needs to be inspected
        </Text>

        <Text style={styles.title}>{'Suggested'}</Text>
        <Text style={styles.question}>
        Get your vehicle inspected online through the RideShare Mechanic! OXO will reimburse you up to $30 per inspection {'\n'}
        </Text>
        <View style={{alignItems: 'center'}}>
        <OxoButton
          type={'outline'}
          buttonSize={'x_large'}
          fontSize={'large'}
          content={'Online inspection'}
          color={'secondary'}
          onPress={()=>{ Linking.openURL("https://ridesharemechanic.com/?gclid=CjwKCAjwpuXpBRAAEiwAyRRPgYNROgp2L1LfiorCInZkDGPXYG3NIaS7HV1m5tFITwPOxFszxj2rNxoCMFoQAvD_BwE")}}
        />
        </View>
        <Text style={styles.title}>{'Alternatives'}</Text>
        <Text style={styles.question}>
        • Go to local mechanic {'\n'}
        • Use Uber/Lyft inspection
        </Text>

        <View style={{padding: Spacing.small}}/>
        </View>}
        </ScrollView>
        </View>

      )
    }
  }



  const mapStateToProps = state => {
    return {
      vehicles: state.vehicles.vehicles
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      dispatchLoadVehicles: (id, token) => dispatch(loadVehicles(id, token)),
      dispatchSaveLicense: (req, id) => dispatch(saveLicense(req, null, id))
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(Inspection));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
      width: "90%",
      marginLeft: '5%',
    },
    images: {
      overflow: 'visible',
      width: 10*Spacing.base,
      height: 10*Spacing.base
    },
    titleContainer: {
      marginTop: Spacing.base,
      flex: 0,
      width: '100%',
      justifyContent: 'flex-start',
    },
    title: {
      color: Colors.primary,
      fontSize: Font.title_3,
      marginTop: Spacing.base
    },
    question: {
      fontSize: Font.large,
      color: Colors.light,
      textAlign: 'left',
      marginTop: Spacing.small,
    },
    pendingApproval: {
      fontSize: Font.large,
      color: Colors.secondary,
      textAlign: 'left',
      marginTop: Spacing.small,
    }

  });
