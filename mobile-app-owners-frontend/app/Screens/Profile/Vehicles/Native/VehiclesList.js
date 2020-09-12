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
import {saveVehicle} from "../Redux/actions";

class VehiclesList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            id: null,
            token: null
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
        this.props.dispatchLoadVehicles(id, token)
    }
    //
    // componentDidUpdate() {
    //     if (this.props.error != null) {
    //         Alert.alert(
    //             'Error.',
    //             'Please try again.' + this.props.error,
    //         );
    //         this.props.dispatchClearError();
    //     }
    // }

    /*
    Description: Render the card items in the ScrollView as TouchableOpacities which can update the default card
    Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
               index => index in the list of this specific item
    Returns: N/A
    */
    populateScrollView () {
        return(
            Object.values(this.props.vehicles).map((vehicle) => {
                return(
                    <TouchableOpacity
                        style={styles.cardContainer}
                        onPress={() => this.props.navigation.navigate('VehicleInfo', {index: vehicle.id})}
                        key={vehicle.id}
                    >
                        {vehicle.vehicleImage ?
                        <Image
                            source={{uri: vehicle.vehicleImage}}
                            resizeMode={'cover'}
                            style={styles.image}
                        /> :
                        <Icon name={'directions-car'} containerStyle={styles.image} size={Icons.large} color={Colors.primary}/>}
                        <View style={{flexDirection: 'column'}}>
                            <Text style={styles.cardInfo}>
                                {vehicle.make + ' ' + vehicle.model + ' ' + (vehicle.plateNumber ? vehicle.plateNumber : '')}
                            </Text>
                            {!vehicle.approved && ((vehicle.plateNumber && vehicle.licenseState && vehicle.vin && vehicle.inspectionImage && vehicle.insuranceImage) ?
                                <Text style={styles.missingInfo}>
                                    {'Pending approval'}
                                </Text> :
                                <Text style={styles.missingInfo}>
                                    {'Missing details'}
                                </Text>)}
                        </View>
                    </TouchableOpacity>
                )
            })
        );
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.white, height:'100%'}}>
              <Loader loading={this.props.loading}/>
                {this.state.id && this.state.token && <NavigationEvents
                    onWillFocus={payload => this.props.dispatchLoadVehicles(this.state.id, this.state.token)}
                />}
                <View style={{width: '100%', height: '11%'}}>
                    <Header
                        icon='chevron-left'
                        title= {"Vehicles"}
                        _callback={() => this.props.navigation.navigate('ProfilePage')}
                        _call={() => {
                            this.props.navigation.navigate('Dashboard');
                        }}/>
                </View>
                <View style={{flex: 6, width: '100%'}}>
                    <ScrollView style={styles.container}>
                        {/*List showing the user's payment methods (i.e. credit cards)*/}
                        {this.populateScrollView()}
                        <TouchableHighlight
                            style={styles.touchableContainer}
                            onPress={() => this.props.navigation.navigate('AddVehicle')}
                            underlayColor={"lightgray"}
                        >
                            <Text style={{color: Colors.primary, fontSize: Font.large, marginBottom: 10, marginTop: 10}}>{'+ Add Vehicle'}</Text>
                        </TouchableHighlight>
                    </ScrollView>
                </View>
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
        vehicles: state.vehicles.vehicles,
        loading: state.vehicles.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatchLoadVehicles: (id, token) => dispatch(loadVehicles(id, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(VehiclesList));

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        width: "90%",
        marginLeft: '5%',
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
        fontSize: Font.large,
        marginLeft: Spacing.small,
        color: Colors.primary,
    },
    missingInfo: {
        fontSize: Font.small,
        marginLeft: Spacing.small,
        color: Colors.secondary,
    },
    image: {
        overflow: 'hidden',
        borderColor: Colors.primary,
        borderWidth: Spacing.lineWidth,
        borderRadius: Icons.large/2,
        width: Icons.large,
        height: Icons.large,
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
        alignItems: 'center',
        marginTop: Spacing.small,
        paddingBottom: Spacing.tiny,
        borderColor: Colors.primary,
        borderBottomWidth: Spacing.lineWidth,
    },
    cardIcon: {
        resizeMode: 'contain',
        width: '15%',
    }
});
