/* First screen that driver sees upon downloading and opening
   OXO driver app.
*/

// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, AsyncStorage } from 'react-native';

// Import elements from separate Node modules
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import { Icon } from 'react-native-elements';

import loginScreens from '../Resources/loginScreens';

// Import Style Guide
import { Spacing, Colors, Font, Icons, Buttons } from '../../Library/Native/StyleGuide';

export default class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ['The car you want','Afforable, flexible, reliable', 'You choose where and when', 'Get matched', 'Start earning'],
            index: 0,
        }
    }

    _renderDotIndicator() {
        return <PagerDotIndicator selectedDotStyle={{backgroundColor: Colors.primary }}pageCount={4} />;
    }

    async componentWillMount() {
        await AsyncStorage.removeItem("token");
    }

    onPageSelected(params) {
        this.setState({
           index: params.position,
        });
    }

    displayHeader() {
        return(
            <View style={styles.logoContainer}>
                <Image style={styles.header} source={require('../../../Resources/whiteLogo.png')}/>
            </View>

        );
    }

    displayFooter() {
        return(
            <View style={styles.footContainer}>
                <Text style={styles.footerText}>{this.state.title[this.state.index]}</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.screen}>
                <StatusBar barStyle="light-content"/>

                {this.displayHeader()}

                <View style={styles.viewPagerContainer}>
                    <IndicatorViewPager onPageSelected={(value) => this.onPageSelected(value)} style={styles.viewPager} indicator={this._renderDotIndicator()}>
                        <View style={styles.graphic}>
                            <Image style={styles.images} source={loginScreens.login1}/>
                        </View>

                        <View style={styles.graphic}>
                            <Image style={styles.images} source={loginScreens.login3}/>
                        </View>

                         <View style={styles.graphic}>
                            <Image style={styles.images} source={loginScreens.login4}/>
                        </View>

                        <View style={styles.graphic}>
                            <Image style={styles.images} source={loginScreens.login5}/>
                        </View>

                    </IndicatorViewPager>
                </View>

                {this.displayFooter()}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={
                          styles.loginButton
                      }
                      onPress={() => this.props.navigation.navigate('PhoneVerification')}
                      >
                      <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => this.props.navigation.navigate('PhoneVerification')}
                    >
                        <Text style={styles.buttonText}>GET STARTED</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )}
}

const styles = StyleSheet.create({
    images: {
        flex:1,
        width: null,
        height: null,
        resizeMode: 'contain',
        marginTop: Spacing.x_large,
        marginBottom: Spacing.x_large,
    },
    header:{
        width: Spacing.magnificent,
        height: 2*Spacing.large,
        marginTop: Spacing.base,
    },
    footContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    footerText: {
        fontSize: Font.title_3,
        color: Colors.primary,
    },
    buttonText: {
        fontSize: Font.title_3,
        color: Colors.white,
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Spacing.buttonRadius,
        backgroundColor: Colors.primary,
        height: 55,
        width: '45%',
    },
    getStartedButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Spacing.buttonRadius,
        backgroundColor: Colors.secondary,
        height: 55,
        width: '45%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
    },
    viewPager: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%'
    },
    viewPagerContainer: {
        flex:5,
        backgroundColor:'white',
        width: '100%',
    },
    graphic: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    screen: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logoContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '20%',
        backgroundColor: Colors.primary,
    },
    title: {
        color: Colors.white,
        fontSize: Font.title_2,
    }
});
