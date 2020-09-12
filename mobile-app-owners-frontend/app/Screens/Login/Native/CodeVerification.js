/* This component is the third screen of the login process.
	 This screen capture a verification code sent to user
	 cell phones.
*/

// Import components from React and React Native
import React from "react";
import { StyleSheet, View } from "react-native";

// Import elements from separate Node modules
import { connect } from "react-redux";

// Import Local Components
import LoginHeader from "./LoginHeader";
import Loader from "../../Library/Native/Loader";
import LoginInput from "../../Library/Native/LoginInput";
import ButtonLeft from "../../Library/Native/ButtonLeft";
import LoginMessage from "./LoginMessage";
import LoginTitle from "./LoginTitle";
import { verifyCode } from "../Redux/actions";
import { Colors, Spacing } from "../../Library/Native/StyleGuide";

const styles = StyleSheet.create({
  message: {
    paddingTop: Spacing.small,
    paddingBottom: Spacing.small,
    color: Colors.white
  },
  screenContainer: {
    flex: 1,
    alignItems: "center",
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    backgroundColor: Colors.primary
  }
});

class CodeVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ""
    };
    this.onFulfill = this.onFulfill.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  async onFulfill() {
    const { phoneInfo, navigation, dispatchVerifyCode } = this.props;
    const phone = phoneInfo;
    const nav = navigation;
    const { code } = this.state;
    dispatchVerifyCode(phone, code, nav);
  }

  goBack() {
    const { navigation } = this.props;
    navigation.navigate("PhoneVerification");
  }

  render() {
    const { code } = this.state;
    const { codeCorrect, loading } = this.props;
    return (
      <View style={styles.screenContainer}>
        <LoginHeader _leftCallback={this.goBack} icon="chevron-left" title="" />
        <Loader loading={loading} />
        <LoginTitle title="Let's verify your phone" />

        <LoginInput
          errorMessage="Incorrect Code"
          hideError={codeCorrect}
          placeholder="Enter confirmation code ####"
          pad="phone-pad"
          label={code ? "4-digit confirmation code" : null}
          _callback={val => {
            this.setState({
              code: val
            });
          }}
          value={code}
        />

        <LoginMessage message="If you are having problems, email info@joinoxo.com" />

        <ButtonLeft
          opacity={code.length === 4 ? 1 : Colors.touchedOpacity}
          color={code.length === 4 ? Colors.secondary : Colors.disabled}
          _callBack={code.length === 4 ? this.onFulfill : () => {}}
          icon="chevron-right"
          title="NEXT"
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    phoneInfo: state.login.phoneInfo,
    loading: state.login.codeLoading,
    codeCorrect: state.login.codeCorrect
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchVerifyCode: (phone, code, nav) => {
      dispatch(verifyCode(phone, code, nav));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeVerification);
