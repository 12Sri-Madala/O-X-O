import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import Header from "../../Library/Native/Header";
import {View, AsyncStorage, StyleSheet} from "react-native";
import { NavigationEvents } from 'react-navigation';
import {Colors} from "../../Library/Native/StyleGuide";
import serverInfo from '../../../Resources/serverInfo'

let stripe_id = 'ca_FVGXnedcwFOsllq6oieDy71EPwdQXQ4G';

export default class StripeOnboarding extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: null,
            token: null,
            firstName: null,
            lastName: null,
            phoneNumber: null,
        }
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('id');
        fetch(`${serverInfo.name}/profile/load`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, token: token})
        }).then((response) => response.json()
        ).then((responseJson) => this.setState({
            id: id,
            token: token,
            firstName: responseJson.profile.firstName,
            lastName: responseJson.profile.lastName,
            phoneNumber: responseJson.profile.phoneNumber
        }))
    }

    handleURLChange = newNavState => {
        console.log(newNavState)
        if (newNavState.url.includes('https://joinoxo.com/?code=')) {
            fetch(`${serverInfo.name}/payments/stripe/saveOwner/`, {
                method: 'POST',
                    headers: {
                    Accept: 'application/json',
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: this.state.id, token: this.state.token, code: newNavState.url.substr(newNavState.url.indexOf('code=')+5)})
            }).then(() => this.props.navigation.navigate('Payment'))
        }
    }

    renderWebView() {
        if (this.state.id && this.state.token && this.state.firstName && this.state.lastName && this.state.phoneNumber) {
            return (
                <WebView
                    source={{ uri: `https://connect.stripe.com/express/oauth/authorize?client_id=${stripe_id}&stripe_user[business_type]=individual&stripe_user[first_name]=${this.state.firstName}&stripe_user[last_name]=${this.state.lastName}&stripe_user[phone_number]=${this.state.phoneNumber}` }}
                    onNavigationStateChange={this.handleURLChange}
                    hideKeyboardAccessoryView={true}
                />
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header
                        icon={"chevron-left"}
                        title= {"Earn"}
                        _call={() => {
                            this.props.navigation.navigate('Dashboard');
                        }}
                        _callback={() => this.props.navigation.navigate('Payment')}
                    />
                </View>

                {this.renderWebView()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: '100%'
    },
    header: {
        width: '100%',
        height: '11%'
    }
})
