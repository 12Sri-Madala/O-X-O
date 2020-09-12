import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import Header from '../../Library//Native/Header';
import EditInput from '../../Library/Native/EditInput';
import { Font, Colors, Spacing } from '../../Library/Native/StyleGuide';

class EditProfileFieldScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      hideError: true
    }

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.regex = regex
  }

  emailValidation(){
    if(this.regex.test(this.state.email)){
        return true
    }
    return false;
  }

  validateEmail(){
    if(this.emailValidation()){
      this.props.navigation.getParam('handleChange')(this.state.email)
    } else {
      this.setState({
        hideError: false
      })
    }
  }

  render(){
    console.log('Attempting to render EditProfileFieldScreen')
    return (
      <View style={styles.screenContainer}>
      <View style={{height:'11%', width: '100%'}}>
      <Header
        icon='chevron-left'
        title='Update email'
        _callback={() => this.props.navigation.navigate('ProfilePage')}
      />
      </View>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        hideError={this.state.hideError}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        errorMessage={"Please enter valid email address"}
        placeholder={this.props.navigation.getParam('placeholder')}
        displayLabel={true}
        label={this.props.navigation.getParam('label')}
        onChangeText={(email)=> this.setState({email})}>
      </EditInput>
      <View
        style={styles.buttonContainer}
        >
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.validateEmail()}
        >
        <Text
          style={styles.buttonText}
          >Save</Text>
      </TouchableOpacity>
      </View>
      </View>
    )
  }
}
export default EditProfileFieldScreen;

const styles = StyleSheet.create({
  screenContainer: {
    height:'100%',
    width: '100%',
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: Font.regular,
    color: Colors.primary,
    paddingVertical: Spacing.tiny,
  },
  valueText: {
    width: '100%',
    fontSize: Font.title_3,
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 9,
    padding: Spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.small,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Font.title_3,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
