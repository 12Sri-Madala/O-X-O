import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  AsyncStorage
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import _ from "lodash";
import { Colors, Font, Spacing, Icons } from "../../Library/Native/StyleGuide";
import OxoButton from "../../Library/Native/OxoButton.js";

import { SET_WAITLIST_OPENED } from "../Redux/types";

import { saveProfileChange } from "../Redux/actions";

import withErrorHandling from "../../../Containers/Native/withErrorHandling";

class WaitlistPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.dispatchCloseWaitlist();
    this.props.navigation.goBack();
  }

  getList() {
    return (
      <View style={styles.listContainer}>
        {_.map(this.props.waitlist.userActions, item => {
          let icon_name = "star";
          if (item.completion === "NO") icon_name = "star-border";
          if (item.completion === "PARTIAL") icon_name = "star-half";
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => {
                this.handleClose();
                if (item.key === "email") {
                  this.props.navigation.navigate(item.route);
                } else if (item.key === "availability") {
                  this.props.navigation.navigate(item.route);
                } else if (item.key === "payment") {
                  this.props.navigation.navigate(item.route);
                }
              }}
            >
              <View style={styles.rowContainer}>
                <Icon
                  name={icon_name}
                  color={Colors.primary}
                  size={Icons.medium}
                />
                <Text style={styles.listText}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  render() {
    console.log(
      "the waitlist in waitlistpage in driversFrontend is",
      this.props.waitlist
    );
    const percent = Math.round(this.props.waitlist.percentile * 100);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Welcome,{" "}
          {this.props.driverInfo.firstName
            ? this.props.driverInfo.firstName
            : ""}
        </Text>
        <Text style={styles.text}> You're currently in the top </Text>
        <Text style={styles.title}> {percent} % </Text>
        <Text style={styles.text}>
          You are on the OXO waitlist. To move up, complete your profile! We'll
          let you know when your account has been activated.
        </Text>
        {this.getList()}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.handleClose}>
            <Text style={styles.text}>Explore</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    waitlist: state.dash.waitlist,
    driverInfo: state.dash.driverInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchCloseWaitlist: () => dispatch({ type: SET_WAITLIST_OPENED }),
    dispatchSaveProfileChange: (update, id, token) =>
      dispatch(saveProfileChange(update, id, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(WaitlistPage));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: "100%",
    backgroundColor: Colors.secondary,
    color: Colors.white
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.small,
    marginLeft: Spacing.base,
    marginRight: Spacing.base,
    borderBottomWidth: 1.5,
    borderColor: Colors.primary
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  listContainer: {
    marginTop: Spacing.small
  },
  title: {
    textAlign: "center",
    color: Colors.primary,
    fontSize: Font.title_1,
    margin: Spacing.small
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 9,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.small
  },
  buttonText: {
    color: Colors.white,
    fontSize: Font.title_3
  },
  listText: {
    textAlign: "left",
    color: Colors.white,
    fontSize: Font.title_3,
    marginLeft: Spacing.base,
    marginRight: Spacing.base
  },
  text: {
    textAlign: "center",
    color: Colors.white,
    fontSize: Font.title_3,
    marginLeft: Spacing.base,
    marginRight: Spacing.base
  }
});
