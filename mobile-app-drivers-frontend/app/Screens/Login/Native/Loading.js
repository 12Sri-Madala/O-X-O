/* First screen that driver sees upon downloading and opening
   OXO driver app.
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, StatusBar, ImageBackground, AsyncStorage, ActivityIndicator } from 'react-native';
import { Colors } from '../../Library/Native/StyleGuide';

export default class Loading extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true, 
        }
    }

    async componentDidMount() {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log(token); 
            const nav = this.props.navigation;
            if (token === null) {
                nav.navigate('WelcomeScreen');          
            } else {
                nav.navigate('Dashboard')
            }
        } catch (error) {
            console.log("error: ", error);
            nav.navigate('WelcomeScreen');
        }
    }

    /*'../Resources/loading.png' <= replace with this path */
    render() {
        return (
            <ImageBackground
                style={styles.backGroundImage}
                source={require('../Resources/blurredBackground.jpg')} 
            >
                <StatusBar barStyle="light-content"/>
                <ActivityIndicator animating={this.state.loading} size='large' color={Colors.primary}/>
            
            </ImageBackground>
        )}
}

const styles = StyleSheet.create({
    backGroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
});
 