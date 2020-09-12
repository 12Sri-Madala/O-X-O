// Import components from React and React Native
import React from "react";
import { StyleSheet, View } from "react-native";

// Import elements from separate Node modules
import { Input } from "react-native-elements";
import { Colors, Font } from "./StyleGuide";

export default class LoginInput extends React.Component {
  // Focus on email input component
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
  }

  componentDidMount() {
    this.input.focus();
  }

  errorMessage() {
    const { hideError, errorMessage } = this.props;
    if (!hideError && hideError !== null) {
      return errorMessage;
    }
  }

  render() {
    const { hidden } = this.state;
    const {
      value,
      placeholder,
      displayError,
      pad,
      _callback,
      label
    } = this.props;
    return (
      <View style={styles.inputContainer}>
        <Input
          label={label || " "} // space prevents input from jumping around when there's no label
          labelStyle={styles.labelText}
          placeholderTextColor={Colors.light}
          placeholder={placeholder}
          multiline={false}
          keyboardType={pad}
          containerStyle={styles.valueContainer}
          inputStyle={[
            styles.valueText,
            displayError ? { color: Colors.error } : {}
          ]}
          ref={input => {
            this.input = input;
          }}
          selectionColor={Colors.white}
          onChangeText={val => _callback(val)}
          errorMessage={this.errorMessage()}
          errorStyle={styles.labelText}
          value={value}
          caretHidden={hidden}
          onTouchStart={() => this.setState({ hidden: false })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: Font.regular,
    color: Colors.white,
    paddingLeft: 0,
    marginLeft: 0,
    fontWeight: "normal"
  },
  valueText: {
    fontSize: Font.title_3,
    color: Colors.white
  },
  labelContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingLeft: 0,
    marginLeft: 0
  },
  valueContainer: {
    flex: 0,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingLeft: 0,
    marginLeft: 0
  },
  inputContainer: {
    overflow: "hidden",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "15%"
  }
});
