/* This is the second screen users see when logging into the OXO driver app.
   This screen captures user phoneNumbers and sends a verification code.
   Based on whether phoneNumber has been seen before, either a new user is
   created or user is sent to dashboard.
*/

// Import components from React and React Native
import React from "react";
import { StyleSheet, View, Alert } from "react-native";

// Import elements from separate Node modules
import validator from "validator";
import { connect } from "react-redux";

// Import local Components
import LoginHeader from "./LoginHeader";
import Loader from "../../Library/Native/Loader";
import LoginInput from "../../Library/Native/LoginInput";
import ButtonLeft from "../../Library/Native/ButtonLeft";
import LoginMessage from "./LoginMessage";
import LoginTitle from "./LoginTitle";
import { Colors, Spacing } from "../../Library/Native/StyleGuide";
import { savePhoneInfo, sendCode } from "../Redux/actions";

class PhoneVerification extends React.Component {
  constructor() {
    super();
    this.state = {
      phone: null,
      displayPhoneError: false,
      validNumber: false
    };
    this.onSendCode = this.onSendCode.bind(this);
    this.goBack = this.goBack.bind(this);
    this.savePhoneChanges = this.savePhoneChanges.bind(this);
  }

  // Called when sendCode is pressed.
  onSendCode() {
    const { dispatchSavePhoneInfo, dispatchSendCode, navigation } = this.props;
    const { phone } = this.state;
    if (validator.isMobilePhone(phone)) {
      const state = dispatchSavePhoneInfo({
        phoneNumber: this.format(phone),
        countryCode: "1"
      });
      dispatchSendCode(state, navigation);
    } else {
      this.setState({ displayPhoneError: true });
      Alert.alert(
        "Sorry!",
        "There was a problem verifying your phone number. Please make sure you have entered the correct number."
      );
    }
  }

  format = phoneNumber => {
    return phoneNumber.replace(/\D/g, "");
  };

  savePhoneChanges(curPhone) {
    this.setState({ displayPhoneError: false });
    const phoneNumber = curPhone.replace(/\D/g, "");
    const partA = phoneNumber.substring(0, 3);
    const partB = phoneNumber.substring(3, 6);
    const partC = phoneNumber.substring(6, 11);
    // 2345678  =>  234-567-8
    if (partC) {
      curPhone = `(${partA}) ${partB}-${partC}`;
    }
    // 2345 => 234-5
    else if (partB) {
      curPhone = `${partA}-${partB}`;
    } else {
      curPhone = phoneNumber;
    }

    this.setState({
      validNumber: phoneNumber.length === 10,
      phone: curPhone,
      displayPhoneError: false
    });
  }

  goBack() {
    const { navigation } = this.props;
    navigation.navigate("WelcomeScreen");
  }

  render() {
    const { loading } = this.props;
    const { displayPhoneError, phone, validNumber } = this.state;
    return (
      <View style={styles.screenContainer}>
        <LoginHeader _leftCallback={this.goBack} icon="chevron-left" title="" />
        <Loader loading={loading} />

        <LoginTitle title="What's your number?" />

        <LoginInput
          placeholder="Mobile phone number"
          displayError={displayPhoneError}
          pad="phone-pad"
          label={phone ? "Mobile phone number" : null}
          _callback={this.savePhoneChanges}
          value={phone}
        />

        <LoginMessage message="We need this to send you a verification code. This will let you login to or create your account." />

        <ButtonLeft
          opacity={validNumber ? 1 : Colors.touchedOpacity}
          color={validNumber ? Colors.secondary : Colors.disabled}
          _callBack={validNumber ? this.onSendCode : () => {}}
          icon="chevron-right"
          title="GET STARTED"
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.login.phoneLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSendCode: (phoneInfo, navigation) =>
      dispatch(sendCode(phoneInfo, navigation)),
    dispatchSavePhoneInfo: phoneInfo => dispatch(savePhoneInfo(phoneInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneVerification);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: "center",
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    backgroundColor: Colors.primary
  }
});
