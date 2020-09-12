/* This is the fourth screen that new users see. It captures
   their first name, last name, and an optional profile picture.
   This screen also needs to integrate with firebase in order
   to create user profiles.
*/

// Import components from React and React Native
import React from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";

// Import elements from separate Node modules
import { connect } from "react-redux";
import validator from "validator";

// Import local components
import LoginHeader from "./LoginHeader";
import LoginTitle from "./LoginTitle";
import LoginInput from "../../Library/Native/LoginInput";
import ButtonLeft from "../../Library/Native/ButtonLeft";
import LoginMessage from "./LoginMessage";
import Loader from "../../Library/Native/Loader";
import { Colors, Spacing } from "../../Library/Native/StyleGuide";
import { saveDriving } from "../Redux/actions";

class DrivingInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      license: null,
      email: null
    };
    this.skipScreen = this.skipScreen.bind(this);
    this.goBack = this.goBack.bind(this);
    this.submitDrivingInfo = this.submitDrivingInfo.bind(this);
  }

  async submitDrivingInfo() {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("id");
    console.log(token);
    const nav = this.props.navigation;
    const req = {
      id,
      token,
      payload: {
        license: this.state.license,
        email: this.state.email
      }
    };
    this.props.dispatchSaveDriving(req, nav);
  }

  skipScreen() {
    this.props.navigation.navigate("Dashboard");
  }

  goBack() {
    this.props.navigation.navigate("ProfileImage");
  }

  render() {
    const { email, license } = this.state;
    const isValid =
      license && license.length > 4 && validator.isEmail(email || "");
    return (
      <View style={styles.screenContainer}>
        <LoginHeader
          cornerText="SKIP"
          _rightCallback={this.skipScreen}
          _leftCallback={this.goBack}
          icon="chevron-left"
          title=""
        />
        <LoginTitle title="How's your driving?" />
        <Loader loading={this.props.drivingLoading} />

        <LoginInput
          errorMessage="Required"
          hideError={license !== ""}
          placeholder="Driver's license number"
          label={license ? "Driver's license number" : null}
          _callback={val => {
            this.setState({ license: val });
          }}
          value={license}
        />
        <LoginInput
          errorMessage="Required"
          hideError={email !== ""}
          placeholder="Email address"
          label={email ? "Email address" : null}
          _callback={val => {
            this.setState({ email: val });
          }}
          value={email}
        />

        <LoginMessage message="If you are having problems, email info@joinoxo.com" />

        <ButtonLeft
          opacity={isValid ? 1 : Colors.touchedOpacity}
          color={isValid ? Colors.secondary : Colors.disabled}
          _callBack={isValid ? this.submitDrivingInfo : () => {}}
          icon="chevron-right"
          title="NEXT"
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    drivingLoading: state.login.drivingLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSaveDriving: (driving, nav) => {
      dispatch(saveDriving(driving, nav));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrivingInfo);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: "center",
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    backgroundColor: Colors.primary
  }
});
