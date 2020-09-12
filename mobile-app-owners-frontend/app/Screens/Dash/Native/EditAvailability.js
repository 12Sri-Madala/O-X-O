/*
Still in development early development, will comment after adding all functionality
Accepted Props:
data - Match data for the give day
updateMatch - callback to update state information in dashboard so it persists
getDayName - function to return the name of a day described by a string
*/

// Import components from React and React Native
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight
} from "react-native";
import { connect } from "react-redux";

// Import elements from separate Node modules
import { Icon } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";

// Import library components
import Modal from "react-native-modal";
import { Appearance } from "react-native-appearance";
import Footer from "../../Library/Native/Footer";
import { Colors, Font, Spacing, Icons } from "../../Library/Native/StyleGuide";
import OxoButton from "../../Library/Native/OxoButton";
import Loader from "../../Library/Native/Loader";

// Import helpers
import {
  convert,
  timeChange,
  initialize,
  findNewData,
  availabilityData
} from "./EditAvailabilityHelpers";

// Import Redux Actions
import { updateData } from "../Redux/actions";

class EditAvailability extends React.Component {
  constructor(props) {
    super(props);
    const { id, pickStart, dropStart, updatedAt, date } = this.props.match;
    let data = {
      id,
      pickStart,
      dropStart,
      updatedAt
    };
    data = JSON.parse(JSON.stringify(data));
    if (data.pickStart == null) {
      initialize(data, date);
    }
    this.state = {
      data,
      availableTemp: null,
      pickStartVis: false,
      dropStartVis: false,
      id: null,
      token: null
    };
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    this.setState({
      id,
      token
    });
  }

  closePickers() {
    this.setState({
      pickStartVis: false,
      dropStartVis: false
    });
  }

  stateUpdate(newData, newState) {
    const updated = {
      ...this.state.data,
      ...newData
    };
    this.setState({
      ...this.state,
      ...newState,
      data: updated
    });
  }

  cancelUpdate() {
    const { id, pickStart, dropStart, updatedAt, date } = this.props.match;
    let data = {
      id,
      pickStart,
      dropStart,
      updatedAt
    };
    data = JSON.parse(JSON.stringify(data));
    if (data.pickStart == null) {
      initialize(data, date);
    }
    this.setState({
      data
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data.updatedAt !== this.props.match.updatedAt) {
      const { id, updatedAt, date } = this.props.match;

      let data = {
        id,
        pickStart: prevState.data.pickStart,
        dropStart: prevState.data.dropStart,
        updatedAt
      };
      data = JSON.parse(JSON.stringify(data));
      if (data.pickStart == null) {
        initialize(data, date);
      }
      this.setState({
        data,
        availableTemp: null,
        showModal: false,
        showModalDrop: false
      });
    }
  }

  isUpdatedPickStart() {
    const { pickStart: pickStartReference } = this.props.match;
    const { pickStart: pickStartStaged } = this.state.data;
    return pickStartReference && pickStartReference !== pickStartStaged;
  }

  isUpdatedDropStart() {
    const { dropStart: dropStartReference } = this.props.match;
    const { dropStart: dropStartStaged } = this.state.data;
    return dropStartReference && dropStartReference !== dropStartStaged;
  }

  getLocationText(value) {
    const { addresses } = this.props;

    if (!value) {
      return "Please select location";
    }
    if ((addresses || {}).homeAddress === value) {
      return "Home address";
    }
    if ((addresses || {}).workAddress === value) {
      return "Work address";
    }
    return value;
  }

  renderOverlay() {
    const { availableTemp } = this.state;
    const available =
      availableTemp !== null
        ? availableTemp
        : this.props.match.status === "Available";
    if (available) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => {
          this.props.dispatchUpdateData(
            availabilityData(
              this.props.match.pickStart === null,
              this.state.data,
              available
            ),
            this.state.data.id,
            this.props.index,
            this.state.id,
            this.state.token
          );
          this.setState({ availableTemp: true });
        }}
      />
    );
  }

  populateModular() {
    let runOnce = true;
    const length = Object.keys(this.props.addresses).length - 1;
    if (Object.keys(this.props.addresses).length > 0) {
      return Object.keys(this.props.addresses).map((name, idx) => {
        if (Object.keys(this.props.addresses)[length] === name) {
          runOnce = !runOnce;
          return (
            <View key={idx}>
              <TouchableOpacity
                style={styles.cardContainer}
                onPress={() => {
                  if (this.state.showModalDrop) {
                    this.props.dispatchUpdateData(
                      { pickupLocation: this.props.addresses[name] },
                      this.state.data.id,
                      this.props.index,
                      this.state.id,
                      this.state.token
                    );
                  } else if (this.state.showModal) {
                    this.props.dispatchUpdateData(
                      { dropoffLocation: this.props.addresses[name] },
                      this.state.data.id,
                      this.props.index,
                      this.state.id,
                      this.state.token
                    );
                  } else {
                    () => {};
                  }
                }}
                key={name}
              >
                {name === "homeAddress" ? (
                  <Icon
                    name="home"
                    containerStyle={styles.image}
                    size={Icons.large}
                    color={Colors.primary}
                  />
                ) : name === "workAddress" ? (
                  <Icon
                    name="work"
                    containerStyle={styles.image}
                    size={Icons.large}
                    color={Colors.primary}
                  />
                ) : (
                  <Icon
                    name="location-on"
                    containerStyle={styles.image}
                    size={Icons.large}
                    color={Colors.primary}
                  />
                )}

                <View style={{ flexDirection: "column" }}>
                  {name === "homeAddress" ? (
                    <Text style={styles.cardInfo}>Home address</Text>
                  ) : name === "workAddress" ? (
                    <Text style={styles.cardInfo}>Work address</Text>
                  ) : (
                    <Text style={styles.cardInfo}>{name}</Text>
                  )}
                  <Text style={styles.missingInfo}>
                    {this.props.addresses[name]}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableHighlight
                style={styles.touchableContainer}
                onPress={() => {
                  this.setState({ showModalDrop: false, showModal: false });
                  this.props.navigation.navigate("AddLocation", {
                    prevLoc: "Dashboard"
                  });
                }}
                underlayColor={Colors.lightGrey}
              >
                <Text style={styles.addAddress}>+ Add address</Text>
              </TouchableHighlight>
            </View>
          );
        }
        return (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={
              this.state.showModalDrop
                ? () => {
                    this.props.dispatchUpdateData(
                      { pickupLocation: this.props.addresses[name] },
                      this.state.data.id,
                      this.props.index,
                      this.state.id,
                      this.state.token
                    ),
                      this.setState({ showModalDrop: false });
                  }
                : this.state.showModal
                ? () => {
                    this.props.dispatchUpdateData(
                      { dropoffLocation: this.props.addresses[name] },
                      this.state.data.id,
                      this.props.index,
                      this.state.id,
                      this.state.token
                    ),
                      this.setState({ showModal: false });
                  }
                : () => {}
            }
            key={name}
          >
            {name === "homeAddress" ? (
              <Icon
                name="home"
                containerStyle={styles.image}
                size={Icons.large}
                color={Colors.primary}
              />
            ) : name === "workAddress" ? (
              <Icon
                name="work"
                containerStyle={styles.image}
                size={Icons.large}
                color={Colors.primary}
              />
            ) : (
              <Icon
                name="location-on"
                containerStyle={styles.image}
                size={Icons.large}
                color={Colors.primary}
              />
            )}

            <View style={{ flexDirection: "column" }}>
              {name === "homeAddress" ? (
                <Text style={styles.cardInfo}>Home address</Text>
              ) : name === "workAddress" ? (
                <Text style={styles.cardInfo}>Work address</Text>
              ) : (
                <Text style={styles.cardInfo}>{name}</Text>
              )}
              <Text style={styles.missingInfo}>
                {this.props.addresses[name]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
    }
    if (runOnce) {
      runOnce = !runOnce;
      return (
        <TouchableHighlight
          style={styles.touchableContainer}
          onPress={() => {
            this.setState({ showModalDrop: false, showModal: false });
            this.props.navigation.navigate("AddLocation", {
              prevLoc: "Dashboard"
            });
          }}
          underlayColor={Colors.lightGrey}
        >
          <Text style={styles.addAddress}>+ Add address</Text>
        </TouchableHighlight>
      );
    }
  }

  render() {
    const pickupAddress = (this.props.match.pickupLocation || {}).street;
    const dropoffAddress = (this.props.match.dropoffLocation || {}).street;
    const { homeAddress } = this.props.addresses || {};
    const { workAddress } = this.props.addresses || {};

    const { availableTemp } = this.state;
    const available =
      availableTemp !== null
        ? availableTemp
        : this.props.match.status === "Available";
    return (
      <View style={styles.container}>
        <Loader loading={this.props.loading} />

        {/* Availability switch */}
        <View style={styles.header}>
          <Text
            style={{
              fontSize: Font.large,
              fontWeight: "bold",
              marginLeft: Spacing.tiny,
              color: available ? Colors.primary : Colors.secondary
            }}
          >
            {available ? "Available" : "Unavailable"}
          </Text>
          <Switch
            value={available}
            trackColor={{ true: Colors.primary, false: Colors.disabled }}
            thumbColor={available ? Colors.disabled : Colors.secondary}
            onValueChange={val => {
              this.props.dispatchUpdateData(
                availabilityData(
                  this.props.match.pickStart === null,
                  this.state.data,
                  available
                ),
                this.state.data.id,
                this.props.index,
                this.state.id,
                this.state.token
              );
              this.setState({ availableTemp: val });
            }}
          />
        </View>
        {this.renderOverlay()}
        <View
          style={
            available ? styles.selectorsContainer : styles.selectorsUnavailable
          }
        >
          {/* Drop-off range time selectors */}
          <View style={styles.selector}>
            <View style={styles.titleContainer}>
              <Text
                style={{
                  ...StyleSheet.flatten(styles.title),
                  color: Colors.primary
                }}
              >
                Drop-off:
              </Text>
            </View>
            <View style={styles.buttons}>
              <OxoButton
                type={this.isUpdatedPickStart() ? "contained" : "outline"}
                buttonSize="large"
                fontSize="large"
                content={convert(this.state.data.pickStart)}
                color="primary"
                icon="keyboard-arrow-down"
                paddingHorizontal={Spacing.small}
                iconLocation="right"
                opacity={available ? Colors.touchedOpacity : 1}
                onPress={
                  available
                    ? () => this.setState({ pickStartVis: true })
                    : () => { }
                }
              />
              <DateTimePicker
                isVisible={this.state.pickStartVis}
                onConfirm={date =>
                  timeChange(
                    date,
                    "pickStart",
                    this.state.data,
                    this.closePickers.bind(this),
                    this.stateUpdate.bind(this)
                  )
                }
                onCancel={() => this.setState({ pickStartVis: false })}
                mode="time"
                titleIOS="Select when you would like to drop off your car"
                date={new Date(this.state.data.pickStart)}
                minuteInterval={15}
                minWidth={320}
                isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
              />
            </View>
            <TouchableOpacity
              style={styles.location}
              activeOpacity={available ? Colors.touchedOpacity : 1}
              onPress={
                available
                  ? () => this.setState({ showModalDrop: true })
                  : () => { }
              }
            >
              {pickupAddress && pickupAddress === homeAddress ? (
                <Icon name="home" color={Colors.primary} size={Icons.medium} />
              ) : pickupAddress && pickupAddress === workAddress ? (
                <Icon name="work" color={Colors.primary} size={Icons.medium} />
              ) : (
                    <Icon
                      name="location-on"
                      color={Colors.primary}
                      size={Icons.medium}
                    />
                  )}
              <Text
                style={{
                  marginRight: Spacing.small,
                  fontSize: Font.large,
                  color: Colors.primary
                }}
              >
                {this.getLocationText(pickupAddress)}
              </Text>
            </TouchableOpacity>
          </View>

          {this.props.addresses && (
            <Modal isVisible={this.state.showModal || this.state.showModalDrop}>
              <View style={{ ...StyleSheet.flatten(styles.modalContent) }}>
                <Text
                  style={{ color: Colors.secondary, fontSize: Font.title_3 }}
                >
                  <Text>Pick New Location</Text>
                </Text>
                <View>
                  {this.populateModular()}
                  <View style={styles.modalContent}>
                    <OxoButton
                      key="cancel"
                      type="outline"
                      buttonSize="large"
                      fontSize="large"
                      content="Cancel"
                      color="secondary"
                      onPress={
                        available
                          ? () =>
                            this.setState({
                              showModalDrop: false,
                              showModal: false
                            })
                          : () => { }
                      }
                      width2height={5}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}

          {/* Pick-up range time selectors */}
          <View style={styles.selector}>
            <View style={styles.titleContainer}>
              <Text
                style={{
                  ...StyleSheet.flatten(styles.title),
                  color: Colors.primary
                }}
              >
                Pick-up:
              </Text>
            </View>
            <View style={styles.buttons}>
              <OxoButton
                type={this.isUpdatedDropStart() ? "contained" : "outline"}
                buttonSize="large"
                fontSize="large"
                content={convert(this.state.data.dropStart)}
                color="primary"
                icon="keyboard-arrow-down"
                paddingHorizontal={Spacing.small}
                iconLocation="right"
                opacity={Colors.touchedOpacity}
                onPress={
                  available
                    ? () => this.setState({ dropStartVis: true })
                    : () => { }
                }
              />
              <DateTimePicker
                isVisible={this.state.dropStartVis}
                onConfirm={date =>
                  timeChange(
                    date,
                    "dropStart",
                    this.state.data,
                    this.closePickers.bind(this),
                    this.stateUpdate.bind(this)
                  )
                }
                onCancel={() => this.setState({ dropStartVis: false })}
                mode="time"
                titleIOS="Select when you would like your car returned"
                date={new Date(this.state.data.dropStart)}
                minuteInterval={15}
                minWidth={320}
                isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
              />
            </View>
            <TouchableOpacity
              style={styles.location}
              activeOpacity={available ? Colors.touchedOpacity : 1}
              onPress={
                available ? () => this.setState({ showModal: true }) : () => {}
              }
            >
              {dropoffAddress && dropoffAddress === homeAddress ? (
                <Icon name="home" color={Colors.primary} size={Icons.medium} />
              ) : dropoffAddress && dropoffAddress === workAddress ? (
                <Icon name="work" color={Colors.primary} size={Icons.medium} />
              ) : (
                    <Icon
                      name="location-on"
                      color={Colors.primary}
                      size={Icons.medium}
                    />
                  )}
              <Text
                style={{
                  marginRight: Spacing.small,
                  fontSize: Font.large,
                  color: Colors.primary
                }}
              >
                {this.getLocationText(dropoffAddress)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          {(this.isUpdatedPickStart() || this.isUpdatedDropStart()) && (
            <Footer
              buttons={[
                {
                  type: available ? "text" : "contained",
                  buttonSize: "large",
                  fontSize: "large",
                  content: "CANCEL",
                  color: available ? "primary" : "secondary",
                  onPress: this.cancelUpdate.bind(this)
                },
                {
                  type: available ? "contained" : "text",
                  buttonSize: "large",
                  fontSize: "large",
                  content: "CONFIRM",
                  color: available ? "secondary" : "primary",
                  onPress: () =>
                    this.props.dispatchUpdateData(
                      findNewData(this.state),
                      this.state.data.id,
                      this.props.index,
                      this.state.id,
                      this.state.token
                    )
                }
              ]}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { matches, loading } = state.dash;
  const { addresses } = state.addresses;
  const { index } = ownProps;
  return {
    match: matches[index],
    loading,
    addresses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchUpdateData: (data, matchId, index, userId, token) =>
      dispatch(updateData(data, matchId, index, userId, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditAvailability);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  header: {
    width: "100%",
    zIndex: 3,
    backgroundColor: Colors.white,
    paddingVertical: Spacing.tiny,
    padding: Spacing.tiny,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: Spacing.lineWidth,
    borderColor: Colors.light
  },
  selectorsContainer: {
    width: "100%",
    flex: 5
  },
  selectorsUnavailable: {
    width: "100%",
    flex: 5
  },
  selector: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    flex: 1
  },
  titleContainer: {
    width: Dimensions.get("window").width - 2 * Spacing.small
  },
  title: {
    fontSize: Font.large,
    fontWeight: "bold"
  },
  buttons: {
    width: Dimensions.get("window").width - 2 * Spacing.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width - 2 * Spacing.small
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Spacing.tiny,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  footer: {
    flex: 1,
    width: "100%"
  },
  cardContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.tiny,
    paddingBottom: Spacing.tiny,
    borderColor: Colors.primary,
    borderBottomWidth: Spacing.lineWidth
  },
  image: {
    overflow: "hidden",
    width: Icons.large,
    height: Icons.large
  },
  cardInfo: {
    fontSize: Font.large,
    marginLeft: Spacing.small,
    color: Colors.primary,
    marginRight: Spacing.small
  },
  missingInfo: {
    fontSize: Font.small,
    marginLeft: Spacing.small,
    marginRight: Spacing.base,
    color: Colors.secondary
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
    backgroundColor: Colors.dark,
    opacity: 0.5
  },
  touchableContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    marginTop: Spacing.small
  },
  addAddress: {
    color: Colors.primary,
    fontSize: Font.large,
    marginBottom: 10,
    marginTop: 10
  }
});
