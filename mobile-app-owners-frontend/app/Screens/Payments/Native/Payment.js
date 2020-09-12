/*
This page loads the driver's payment information (i.e. credit cards) and
allows them to change the default card as well as link to NewCardPage
where they can add additional payment methods
*/
import React from 'react';
import {StyleSheet, Text, View, ScrollView, ImageBackground, StatusBar, Button, Image, TouchableOpacity, TouchableHighlight,
    FlatList, Alert, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { Icon } from 'react-native-elements';

// Import local components
import Header from '../../Library/Native/Header';
import Loader from '../../Library/Native/Loader';
import OxoButton from '../../Library/Native/OxoButton.js';
import withErrorHandling from '../../../Containers/Native/withErrorHandling';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../Library/Native/StyleGuide.js';
import cardIcons from "../../Payments/Resources/cardIcons";
import serverInfo from "../../../Resources/serverInfo";

// Import Redux Actions

export default class Payment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            token: null,
            accounts: null,
            loading: true
        }
    }

    async componentDidMount(){
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('id');
        this.getAccount(id, token);
        this.setState({
            id: id,
            token: token,
        });

    }

    async getAccount(id, token) {
        let accounts = await fetch(`${serverInfo.name}/payments/stripe/getAccount`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, token: token})}).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.accounts) return responseJson.accounts.data;
                return null;
        });
        this.setState({
            accounts: accounts,
            loading: false
        });
    }

    pickCardIcon(brand){
        switch (brand) {
            case "Visa": return cardIcons.visa;
            case "American Express": return cardIcons.american_express;
            case "MasterCard": return cardIcons.master_card;
            case "Discover": return cardIcons.discover;
            case "JCB": return cardIcons.jcb;
            case "Diners Club": return cardIcons.diners_club;
            case "Bank": return cardIcons.bank;
            default: return cardIcons.placeholder;
        }
    }

    populateScrollView () {
        return(
            this.state.accounts.map((item, index) => {
                let brand = item.brand ? item.brand : item.bank_name;
                return(
                    <View
                        style={styles.cardContainer}
                        key={index}
                    >
                        <Image source={this.pickCardIcon(item.brand ? brand : 'Bank')} style={styles.cardIcon}/>
                        <Text style={styles.cardInfo}>
                            {(brand + " " + item.last4)}
                        </Text>
                    </View>
                )
            })
        );
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.white, height:'100%'}}>
                {this.state.id && this.state.token && <NavigationEvents
                    onWillFocus={payload => {
                        this.setState({loading: true})
                        this.getAccount(this.state.id, this.state.token);
                    }}
                />}
                <Loader loading={this.state.loading}/>
                <View style={{width: '100%', height: '11%'}}>
                    <Header
                        title= {"Earn"}
                        _call={() => {
                            this.props.navigation.navigate('Dashboard');
                        }}/>
                </View>
                <ScrollView style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{'Payments'}</Text>
                    </View>

                    {this.state.id && this.state.token && !this.state.loading && <View style={{flex: 6, width: '100%', marginTop: Spacing.small}}>

                        {this.state.accounts ?
                            this.populateScrollView() :
                            <Text style={styles.question}>
                                Connect with Stripe to start getting paid today
                            </Text>
                        }

                        <View style={{alignItems: 'center', margin: Spacing.base}}>
                            {this.state.accounts ?
                            <OxoButton
                                type={'outline'}
                                buttonSize={'large'}
                                fontSize={'large'}
                                content={'Account'}
                                color={'primary'}
                                iconLocation= 'left'
                                onPress={() => {this.props.navigation.navigate('StripeDashboard')}}/> :
                            <OxoButton
                                type={'outline'}
                                buttonSize={'large'}
                                fontSize={'large'}
                                content={'Connect'}
                                color={'secondary'}
                                iconLocation= 'left'
                                onPress={() => {this.props.navigation.navigate('StripeOnboarding')}}/>}
                        </View>
                    </View>}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        width: "90%",
        marginLeft: '5%',
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
    },
    question: {
        fontSize: Font.large,
        color: Colors.light,
        textAlign: 'left',
        marginTop: Spacing.small,
        // marginLeft: Spacing.small,
        // marginRight: Spacing.small,
    },
    cardInfo: {
        fontSize: Font.regular,
        marginLeft: Spacing.small,
        color: "black",
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.tiny,
        borderColor: Colors.light,
        borderBottomWidth: Spacing.lineWidth,
    },
    cardIcon: {
        resizeMode: 'contain',
        width: '15%',
    }

});
