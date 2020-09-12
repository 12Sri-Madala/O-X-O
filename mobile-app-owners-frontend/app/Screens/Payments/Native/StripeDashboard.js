import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import Header from "../../Library/Native/Header";
import {View, AsyncStorage, StyleSheet} from "react-native";
import { NavigationEvents } from 'react-navigation';
import {Colors} from "../../Library/Native/StyleGuide";
import serverInfo from '../../../Resources/serverInfo'

export default class StripeDashboard extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: null,
            token: null,
            url: null
        }
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('token');
        const id = await AsyncStorage.getItem('id');
        fetch(`${serverInfo.name}/payments/stripe/dashboard/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, token: token})
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    url: responseJson.login.url
                });
            });

    }

    renderWebView() {
        if (this.state.url) {
            return (
                <WebView
                    source={{ uri: this.state.url }}
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
