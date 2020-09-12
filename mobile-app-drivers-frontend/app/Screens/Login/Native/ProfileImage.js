/* This is the fourth screen that new users see. It captures
   their first name, last name, and an optional profile picture.
   This screen also needs to integrate with firebase in order
   to create user profiles.
   By: Zac Espinosa
*/

// Import components from React and React Native
import React from 'react';
import { StyleSheet, View, Image, AsyncStorage, Alert } from 'react-native';

// Import elements from separate Node modules
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';

// Import local components
import LoginHeader from './LoginHeader';
import LoginTitle from './LoginTitle';
import ButtonLeft from '../../Library/Native/ButtonLeft';
import LoginMessage from './LoginMessage';
import Loader from '../../Library/Native/Loader';
// import fire from '../../Library/Native/Firebase';
import { Colors, Spacing, Icons } from '../../Library/Native/StyleGuide';
import { saveProfileImage } from '../Redux/actions';

class ProfileImage extends React.Component {
  constructor() {
    super();
    this.state = {
        opacity: Colors.touchedOpacity,
        buttonColor: Colors.disabled,
        uploaded: false,
        uri: null,
        base64: null
    }
    this.skipScreen = this.skipScreen.bind(this);
    this.goBack = this.goBack.bind(this);
    this.saveProfilePicture = this.saveProfilePicture.bind(this);
    this._editImage = this._editImage.bind(this);
  }

  async saveProfilePicture() {
    const token = await AsyncStorage.getItem('token');
    const id = await AsyncStorage.getItem('id');
    const nav = this.props.navigation;
    const req = {
        id: id,
        token: token,
        payload: {
            uri: this.state.uri,
            base64: this.state.base64
        }
    }
    this.props.dispatchSaveProfileImage(req, nav);
  }

  // Allows drivers to edit either profile picture. Called when edit icon is clicked
  async _editImage() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result;
    Alert.alert(
        'Select profile picture',
        '',
        [
            {text: 'Photo Library', onPress: async () => {result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    quality: 0.1,
                    base64: true,
                });
                    if (!result.cancelled) {
                        this.setState({
                            base64: result.base64,
                            uri: result.uri,
                            uploaded: true,
                            buttonColor: Colors.secondary,
                            opacity: 1
                        });
                    }}},
            {text: 'Camera', onPress: async () => {result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    quality: 0.1,
                    base64: true,
                });
                    if (!result.cancelled) {
                        this.setState({
                            base64: result.base64,
                            uri: result.uri,
                            uploaded: true,
                            buttonColor: Colors.secondary,
                            opacity: 1
                        });
                    }}},
          {text: 'Cancel', style: 'cancel',
            },
        ],
        {cancelable: true},
    );
}

  renderProfileImage() {
    if (this.state.uri === null) {
        return(
            <Icon
                name="person"
                size={Icons.huge}
                color={Colors.primary}
                raised={true}
                onPress={() => this._editImage()}/>
        );
    } else {
        console.log(this.state.uri);
        return(
            <Image style={styles.image} source={{uri: this.state.uri}}/>
        );
    }
  }

  skipScreen() {
    this.props.navigation.navigate('DrivingInfo');
  }

  goBack() {
    this.props.navigation.navigate('NewUser');
  }

  render() {
    return (
        <View style={styles.screenContainer}>
            <LoginHeader
                cornerText='SKIP'
                _rightCallback={this.skipScreen}
                _leftCallback={this.goBack}
                icon='chevron-left' title=''/>
            <LoginTitle title='Add a profile photo'></LoginTitle>
            <Loader loading={this.props.imageLoading} />

            <LoginMessage message='This helps the person giving you their car recognize you. Use a photo that clearly shows your face.'></LoginMessage>

            <View style={styles.imageContainer}>
                {this.renderProfileImage()}
            </View>
            <View style={styles.iconContainer}>
                <Icon
                    reverse
                    name="edit"
                    size={Icons.medium}
                    color={Colors.secondary}
                    raised={true}
                    reverseColor={Colors.white}
                    onPress={() => this._editImage()}/>
            </View>

            <ButtonLeft
                opacity={this.state.opacity}
                color={this.state.buttonColor}
                _callBack={ this.state.uploaded ? this.saveProfilePicture : () => {} }
                icon='chevron-right'
                title='NEXT'>
            </ButtonLeft>

        </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        imageLoading: state.login.imageLoading,
    }
  }

const mapDispatchToProps = dispatch => {
  return {
    dispatchSaveProfileImage: (req, nav) => { dispatch(saveProfileImage(req, nav)) } ,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProfileImage);

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    iconContainer: {
        width: 200,
        alignItems: 'flex-end',
        marginTop: -50
    },
    imageContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        width: 200,
        height: 200,
        borderRadius: 100,
        marginTop: 50,
    },
    screenContainer: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: Spacing.small,
        paddingRight: Spacing.small,
        backgroundColor: Colors.primary,
    },
});
