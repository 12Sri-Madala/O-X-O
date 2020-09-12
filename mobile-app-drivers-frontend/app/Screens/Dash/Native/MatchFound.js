/*
Still in early development, will comment after adding all functionality
Accepted Props:
	data -
	updateMatch -
	navigate -
	getDayName -
*/

// Import components from React and React Native
import React from "react";
import { StyleSheet, Text, View, Alert, AsyncStorage } from "react-native";
import { connect } from "react-redux";

// Import local components
import MatchInfo from "./MatchInfo";
import OwnerInfo from "./OwnerInfo";

// Import helpers
import { determineButtons } from "./MatchFoundHelpers";

// Import library components
import Footer from "../../Library/Native/Footer";
import { Colors, Spacing, Font } from "../../Library/Native/StyleGuide";
import { Dash } from "../../Library/Native/LanguageGuide";
import Loader from "../../Library/Native/Loader";

// Import Redux Actions
import {
  updateConnAndMatchStatus,
  updateData,
  fetchConnection
} from "../Redux/actions";

import serverInfo from "../../../Resources/serverInfo";

class MatchFound extends React.Component {
  constructor(props) {
    super(props);
    this.owner = this.props.owners.find(owner => {
      return `${owner.id}` === this.props.matches[this.props.index].ownerID;
    });
    this.vehicle = this.props.vehicles.find(car => {
      return `${car.id}` === this.props.matches[this.props.index].carID;
    });
    this.state = {};
    this.updateConnection = this.updateConnection.bind(this);
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    await this.setState({
      id,
      token
    });
  }

  /* TODO: make this deploy a request for driver queues */
  confirm() {
    const { id, token } = this.state;
    Alert.alert(
      "Confirm",
      "Just to confirm, you will be charged $50 24 hours before your meetup.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            this.props.dispatchUpdateData(
              { status: "Confirmed" },
              this.props.matches[this.props.index].id,
              this.props.index,
              id,
              token
            );
          }
        }
      ]
    );
  }

  cancel() {
    const { id, token } = this.state;
    if (this.props.matches[this.props.index].status === "Confirmed") {
      Alert.alert(
        "Warning!",
        "Removing your availability within 24 hours of a match will result in a fine.  Do you wish to continue?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "Continue",
            onPress: () => this.updateConnection(),
            style: "destructive"
          }
        ]
      );
    } else {
      this.props.dispatchUpdateData(
        { status: "Available" },
        this.props.matches[this.props.index].id,
        this.props.index,
        id,
        token
      );
    }
  }

  updateConnection() {
    const { id, token } = this.state;
    try {
      this.props.dispatchFetchConnection(id, token);
      this.props.dispatchUpdateConnAndMatchStatus(
        id,
        token,
        this.props.connection.id,
        "CANCELED",
        "Available",
        this.props.index,
        this.props.matches[this.props.index].id
      );
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Loader loading={this.props.loading} />

        <View style={styles.header}>
          <Text style={styles.headerContent}>
            {Dash.Found[this.props.matches[this.props.index].status]}
          </Text>
        </View>

        <MatchInfo data={this.props.matches[this.props.index]} />

        <OwnerInfo
          owner={this.owner}
          car={this.vehicle}
          number={this.props.matches[this.props.index].proxyNumber}
        />

        <View
          style={{
            ...StyleSheet.flatten(styles.footer),
            backgroundColor:
              this.props.matches[this.props.index].status === "Confirmed"
                ? Colors.disabled
                : Colors.white
          }}
        >
          <Footer
            buttons={determineButtons(
              this.props.matches[this.props.index].status,
              [this.cancel.bind(this), this.confirm.bind(this)],
              loc => this.props.navigate(loc)
            )}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    matches: state.dash.matches,
    owners: state.dash.owners,
    vehicles: state.dash.vehicles,
    loading: state.dash.loading,
    connection: state.dash.connection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchUpdateConnAndMatchStatus: (
      userId,
      token,
      connectionID,
      connectionStatus,
      matchStatus,
      index,
      matchId
    ) =>
      dispatch(
        updateConnAndMatchStatus(
          userId,
          token,
          connectionID,
          connectionStatus,
          matchStatus,
          index,
          matchId
        )
      ),
    dispatchUpdateData: (data, matchId, index, userId, token) =>
      dispatch(updateData(data, matchId, index, userId, token)),
    dispatchFetchConnection: (id, token) => dispatch(fetchConnection(id, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchFound);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center"
  },
  header: {
    width: "100%",
    paddingVertical: Spacing.tiny,
    borderBottomWidth: Spacing.lineWidth,
    borderColor: Colors.light,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContent: {
    fontSize: Font.large,
    fontWeight: "bold",
    color: Colors.secondary
  },
  footer: {
    flex: 1.5,
    width: "100%"
  }
});
