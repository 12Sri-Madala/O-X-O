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
import {loadAddresses} from '../Redux/actions.js'

class LocationList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            addresses: null,
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
         this.setState({
            id: id,
            token: token,
        });
        this.props.dispatchLoadAddresses(id, token)
    }

    /*
    Description: Render the card items in the ScrollView as TouchableOpacities which can update the default card
    Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
               index => index in the list of this specific item
    Returns: N/A
    */
 populateScrollView () {
        return(
        Object.keys(this.props.addresses).map((name) => {
            if(this.props.addresses.hasOwnProperty(name)){
            return(
                <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() => this.props.navigation.navigate('LocationInfo', {name: name})}
                    key={name}
                >
                {name === 'homeAddress' ?
                  <Icon
                  name = {'home'}
                  containerStyle={styles.image}
                  size={Icons.large}
                  color={Colors.primary}
                  />
                  :
                  name === 'workAddress' ?
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

                    <View style={{flexDirection: 'column'}}>
                    {name === 'homeAddress' ?
                    <Text style={styles.cardInfo}>
                        {'Home address'}
                    </Text>
                      :
                      name === 'workAddress' ?
                      <Text style={styles.cardInfo}>
                          {'Work address'}
                      </Text>
                      :
                      <Text style={styles.cardInfo}>
                        {name}
                      </Text>
                      }
                      <Text style={styles.missingInfo}>
                            {this.props.addresses[name]}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }
      })
    )
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.white, height:'100%'}}>
            {this.state.id && this.state.token && <NavigationEvents
                    onWillFocus={payload => this.props.dispatchLoadAddresses(this.state.id, this.state.token)}
                />}
                <View style={{width: '100%', height: '11%'}}>
                    <Header
                        icon='chevron-left'
                        title= {"Locations"}
                        _callback={() => this.props.navigation.navigate('ProfilePage')}
                        _call={() => {
                            this.props.navigation.navigate('Dashboard')
                        }}/>
                </View>
                <View style={{flex: 6, width: '100%'}}>
                  <ScrollView style={styles.container}>
              {this.props.addresses && this.populateScrollView()}
              <TouchableHighlight
                  style={styles.touchableContainer}
                  onPress={() => this.props.navigation.navigate('AddLocation', {prevLoc: 'LocationList'})}
                  underlayColor={"lightgray"}
              >
                  <Text style={{color: Colors.primary, fontSize: Font.large, marginBottom: 10, marginTop: 10}}>{'+ Add location'}</Text>
              </TouchableHighlight>
            </ScrollView>
                </View>
                </View>

        )
      }
}




const mapStateToProps = state => {
    return {
        addresses: state.addresses.addresses,
        loadingAddresses: state.addresses.loadingAddresses,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      dispatchLoadAddresses: (id, token) => dispatch(loadAddresses(id, token)),
      dispatchSaveAddress: (address, nav) => { dispatch(saveAddress(address, nav)) } ,

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(LocationList));

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
        marginRight: Spacing.large,
        color: Colors.secondary,
    },
    image: {
        overflow: 'hidden',
        // borderColor: Colors.primary,
        // borderWidth: Spacing.lineWidth,
        // borderRadius: Icons.medium/2,
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
