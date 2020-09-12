import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { Colors, Font, Spacing, Icons } from "../../Library/Native/StyleGuide";

import { SET_WAITLIST_OPENED } from "../Redux/types";

import withErrorHandling from "../../../Containers/Native/withErrorHandling";

class WaitlistPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  getList() {
    const { waitlist, navigation } = this.props;
    console.log("Getting into the list");
    return (
      <View style={styles.listContainer}>
        {waitlist.userActions.map((item, idx) => {
          let iconName = "star";
          if (item.completion === "NO") iconName = "star-border";
          if (item.completion === "PARTIAL") iconName = "star-half";
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => {
                this.handleClose();
                if (item.key === "email") {
                  navigation.navigate(item.route);
                } else if (item.key === "availability") {
                  navigation.navigate(item.route);
                } else if (item.key === "payment") {
                  navigation.navigate(item.route);
                }
              }}
            >
              <View style={styles.rowContainer} key={idx}>
                <Icon
                  name={iconName}
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

  handleClose() {
    const { dispatchCloseWaitlist, navigation } = this.props;
    dispatchCloseWaitlist();
    navigation.goBack();
  }

  render() {
    const { waitlist, owner } = this.props;
    console.log("the percentile is", waitlist.percentile);
    const percent =
      waitlist.percentile === 1
        ? 1
        : Math.round((1 - waitlist.percentile) * 100);
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Welcome,
          {owner ? ` ${owner.firstName}` : ""}
        </Text>
        <Text style={styles.text}> You&apos;re currently in the top</Text>
        <Text style={styles.title}>{`${percent}%`}</Text>
        <Text style={styles.text}>
          You are on the OXO waitlist. To move up, complete your profile!
          We&apos;ll let you know when your account has been activated.
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

const mapStateToProps = state => ({
  waitlist: state.dash.waitlist,
  owner: state.dash.owner
});

const mapDispatchToProps = dispatch => ({
  dispatchCloseWaitlist: () =>
    dispatch({
      type: SET_WAITLIST_OPENED
    })
});

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
