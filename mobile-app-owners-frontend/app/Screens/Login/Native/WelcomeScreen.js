/* First screen that driver sees upon downloading and opening
   OXO driver app.
*/
// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, AsyncStorage } from 'react-native';

// Import elements from separate Node modules
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import {Icon} from 'react-native-elements';

import loginScreens from '../Resources/loginScreens';

// Import Style Guide
import { Spacing, Colors, Font, Icons, Buttons } from '../../Library/Native/StyleGuide.js';
import OxoButton from '../../Library/Native/OxoButton.js';

export default class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ['While you\'re at work, your car is too','Tell OXO your commute plans', 'Get matched with Uber/Lyft drivers', 'No more parking, earn extra $$!'],
            index: 0,
        }
    }

    renderDotIndicator() {
         return(
          <PagerDotIndicator
            selectedDotStyle={{backgroundColor: Colors.primary }}
            pageCount={4} />
          )
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
                <Image
                  style={styles.header}
                  source={require('../../../Resources/whiteLogo.png')}/>
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
                    <IndicatorViewPager
                      onPageSelected={(value) => this.onPageSelected(value)}
                      style={styles.viewPager}
                      indicator={this.renderDotIndicator()}>
                        <View style={styles.graphic}>
                            <Image
                              style={styles.images}
                              source={loginScreens.login1}/>
                        </View>

                        <View style={styles.graphic}>
                            <Image
                              style={styles.images}
                              source={loginScreens.login3}/>
                        </View>

                         <View style={styles.graphic}>
                            <Image
                              style={styles.images}
                              source={loginScreens.login4}/>
                        </View>

                        <View style={styles.graphic}>
                            <Image
                              style={styles.images}
                              source={loginScreens.login5}/>
                        </View>

                    </IndicatorViewPager>
                </View>

                {this.displayFooter()}

                <View style={styles.buttons}>
                    <OxoButton
                      type= {'outline'}
                      buttonSize = {'larger'}
                      fontSize= {'large'}
                      content= {'LOGIN'}
                      color = {'primary'}
                      onPress={() => this.props.navigation.navigate('PhoneVerification')}
                      />
                    <OxoButton
                      type= {'contained'}
                      buttonSize = {'larger'}
                      fontSize= {'large'}
                      content= {'GET STARTED'}
                      color = {'secondary'}
                      onPress={() => this.props.navigation.navigate('PhoneVerification')}
                    />
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
        marginLeft: Spacing.small,
        marginRight: Spacing.small,
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
        marginTop: Spacing.tiny,
    },
    buttons: {
      flex:1,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
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
});
