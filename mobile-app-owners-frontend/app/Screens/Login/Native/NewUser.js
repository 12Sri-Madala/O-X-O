/* This is the fourth screen that new users see. It captures
   their first name, last name, and an optional profile picture.
   This screen also needs to integrate with firebase in order
   to create user profiles.
   By: Zac Espinosa
*/

// Import components from React and React Native
import React from "react";
import { StyleSheet, View, Keyboard } from "react-native";

// Import elements from separate Node modules
import { connect } from "react-redux";

import PropTypes from "prop-types";

// Import local components
import LoginHeader from "./LoginHeader";
import LoginTitle from "./LoginTitle";
import LoginInput from "../../Library/Native/LoginInput";
import ButtonLeft from "../../Library/Native/ButtonLeft";
import LoginMessage from "./LoginMessage";
import Loader from "../../Library/Native/Loader";
import { Colors, Spacing } from "../../Library/Native/StyleGuide";
import { saveUser } from "../Redux/actions";

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: "center",
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    backgroundColor: Colors.primary
  }
});

class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null
    };
    this.goBack = this.goBack.bind(this);
    this.submitUserInfo = this.submitUserInfo.bind(this);
  }

  async submitUserInfo() {
    const { firstName, lastName } = this.state;
    const {
      phoneInfo,
      phoneInfo: { countryCode, phoneNumber },
      navigation,
      dispatchSaveUser
    } = this.props;
    console.log(phoneInfo);
    const user = {
      firstName,
      lastName,
      phoneNumber: `+${countryCode}${phoneNumber}`
    };
    console.log(user);
    const nav = navigation;
    Keyboard.dismiss();
    dispatchSaveUser(user, nav);
  }

  goBack() {
    const { navigation } = this.props;
    navigation.navigate("CodeVerification");
  }

  render() {
    const { nameLoading } = this.props;
    const { firstName, lastName } = this.state;

    return (
      <View style={styles.screenContainer}>
        <LoginHeader _leftCallback={this.goBack} icon="chevron-left" title="" />
        <LoginTitle title="Tell us your name" />
        <Loader loading={nameLoading} />

        <LoginInput
          errorMessage="Required"
          hideError={firstName !== ""}
          placeholder="First name"
          label={firstName ? "First name" : null}
          _callback={val => {
            this.setState({ firstName: val });
          }}
          value={firstName}
        />
        <LoginInput
          errorMessage="Required"
          hideError={lastName !== ""}
          placeholder="Last name"
          label={lastName ? "Last name" : null}
          _callback={val => {
            this.setState({ lastName: val });
          }}
          value={lastName}
        />

        <LoginMessage message="If you are having problems, email info@joinoxo.com" />

        <ButtonLeft
          opacity={firstName && lastName ? 1 : Colors.touchedOpacity}
          color={firstName && lastName ? Colors.secondary : Colors.disabled}
          _callBack={firstName && lastName ? this.submitUserInfo : () => {}}
          icon="chevron-right"
          title="NEXT"
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    nameLoading: state.login.nameLoading,
    phoneInfo: state.login.phoneInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSaveUser: (user, nav) => {
      dispatch(saveUser(user, nav));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewUser);

// TODO
NewUser.propTypes = {
  phoneInfo: PropTypes.object
};
