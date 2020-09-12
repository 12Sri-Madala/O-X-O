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
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";

// Import elements from separate Node modules
import { Icon } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from "react-native-appearance";

// Import library components
import Footer from "../../Library/Native/Footer";
import { Colors, Font, Spacing, Icons } from "../../Library/Native/StyleGuide";
import OxoButton from "../../Library/Native/OxoButton";
import Loader from "../../Library/Native/Loader";

// Import helpers
import {
  convert,
  timeChange,
  locationAlert,
  initialize,
  findNewData,
  availabilityData
} from "./EditAvailabilityHelpers";

// Import Redux Actions
import { updateData } from "../Redux/actions";

class EditAvailability extends React.Component {
  constructor(props) {
    super(props);
    const {
      id,
      pickStart,
      pickEnd,
      dropStart,
      dropEnd,
      date,
      updatedAt
    } = this.props.match;
    let data = {
      id,
      pickStart,
      pickEnd,
      dropStart,
      dropEnd,
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
      pickEndVis: false,
      dropStartVis: false,
      dropEndVis: false,
      id: null,
      token: null
    };
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    await this.setState({
      id,
      token
    });
  }

  closePickers() {
    this.setState({
      pickStartVis: false,
      pickEndVis: false,
      dropStartVis: false,
      dropEndVis: false
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
    const {
      id,
      pickStart,
      pickEnd,
      dropStart,
      dropEnd,
      updatedAt,
      date
    } = this.props.match;
    let data = {
      id,
      pickStart,
      pickEnd,
      dropStart,
      dropEnd,
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data.updatedAt !== this.props.match.updatedAt) {
      const { id, date, updatedAt } = this.props.match;
      let data = {
        id,
        pickStart: prevState.data.pickStart,
        pickEnd: prevState.data.pickEnd,
        dropStart: prevState.data.dropStart,
        dropEnd: prevState.data.dropEnd,
        updatedAt
      };
      data = JSON.parse(JSON.stringify(data));
      if (data.pickStart == null) {
        initialize(data, date);
      }
      this.setState({
        data,
        availableTemp: null
      });
    }
  }

  isUpdatedPickStart() {
    const { pickStart: pickStartReference } = this.props.match;
    const { pickStart: pickStartStaged } = this.state.data;
    return pickStartReference && pickStartReference !== pickStartStaged;
  }

  isUpdatedPickEnd() {
    const { pickEnd: pickEndReference } = this.props.match;
    const { pickEnd: pickEndStaged } = this.state.data;
    return pickEndReference && pickEndReference !== pickEndStaged;
  }

  isUpdatedDropStart() {
    const { dropStart: dropStartReference } = this.props.match;
    const { dropStart: dropStartStaged } = this.state.data;
    return dropStartReference && dropStartReference !== dropStartStaged;
  }

  isUpdatedDropEnd() {
    const { dropEnd: dropEndReference } = this.props.match;
    const { dropEnd: dropEndStaged } = this.state.data;
    return dropEndReference && dropEndReference !== dropEndStaged;
  }

  render() {
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
                type={this.isUpdatedPickStart() ? "contained" : "outline"}
                buttonSize="large"
                fontSize="large"
                content={convert(this.state.data.pickStart)}
                color="primary"
                icon="keyboard-arrow-down"
                iconLocation="right"
                opacity={available ? Colors.touchedOpacity : 1}
                onPress={
                  available
                    ? () => this.setState({ pickStartVis: true })
                    : () => {}
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
                titleIOS="Select the start of your pick-up range"
                date={new Date(this.state.data.pickStart)}
                minuteInterval={15}
                minWidth={320}
                isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
              />
              <Text
                style={{
                  fontSize: Font.large,
                  color: Colors.primary
                }}
              >
                to
              </Text>
              <OxoButton
                type={this.isUpdatedPickEnd() ? "contained" : "outline"}
                buttonSize="large"
                fontSize="large"
                content={convert(this.state.data.pickEnd)}
                color="primary"
                icon="keyboard-arrow-down"
                iconLocation="right"
                opacity={available ? Colors.touchedOpacity : 1}
                onPress={
                  available
                    ? () => this.setState({ pickEndVis: true })
                    : () => {}
                }
              />
              <DateTimePicker
                isVisible={this.state.pickEndVis}
                onConfirm={date =>
                  timeChange(
                    date,
                    "pickEnd",
                    this.state.data,
                    this.closePickers.bind(this),
                    this.stateUpdate.bind(this)
                  )
                }
                onCancel={() => this.setState({ pickEndVis: false })}
                mode="time"
                titleIOS="Select the end of your pick-up range"
                date={new Date(this.state.data.pickEnd)}
                minuteInterval={15}
                minWidth={320}
                isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
              />
            </View>
            <TouchableOpacity
              style={styles.location}
              activeOpacity={available ? Colors.touchedOpacity : 1}
              onPress={available ? locationAlert : () => {}}
            >
              <Icon
                name="location-on"
                color={Colors.primary}
                size={Icons.medium}
              />
              <Text
                style={{
                  fontSize: Font.large,
                  color: Colors.primary
                }}
              >
                San Francisco
              </Text>
            </TouchableOpacity>
          </View>

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
                type={this.isUpdatedDropStart() ? "contained" : "outline"}
                buttonSize="large"
                fontSize="large"
                content={convert(this.state.data.dropStart)}
                color="primary"
                icon="keyboard-arrow-down"
                iconLocation="right"
                opacity={available ? Colors.touchedOpacity : 1}
                onPress={
                  available
                    ? () => this.setState({ dropStartVis: true })
                    : () => {}
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
                titleIOS="Select the start of your drop-off range"
                date={new Date(this.state.data.dropStart)}
                minuteInterval={15}
                minWidth={320}
                isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
              />
              <Text
                style={{
                  fontSize: Font.large,
                  color: Colors.primary
                }}
              >
                to
              </Text>
              <OxoButton
                type={this.isUpdatedDropEnd() ? "contained" : "outline"}
                buttonSize="large"
                fontSize="large"
                content={convert(this.state.data.dropEnd)}
                color="primary"
                icon="keyboard-arrow-down"
                iconLocation="right"
                opacity={available ? Colors.touchedOpacity : 1}
                onPress={
                  available
                    ? () => this.setState({ dropEndVis: true })
                    : () => {}
                }
              />
              <DateTimePicker
                isVisible={this.state.dropEndVis}
                onConfirm={date =>
                  timeChange(
                    date,
                    "dropEnd",
                    this.state.data,
                    this.closePickers.bind(this),
                    this.stateUpdate.bind(this)
                  )
                }
                onCancel={() => this.setState({ dropEndVis: false })}
                mode="time"
                titleIOS="Select the end of your drop-off range"
                date={new Date(this.state.data.dropEnd)}
                minuteInterval={15}
                minWidth={320}
                isDarkModeEnabled={Appearance.getColorScheme() === "dark"}
              />
            </View>
            <TouchableOpacity
              style={styles.location}
              activeOpacity={available ? Colors.touchedOpacity : 1}
              onPress={available ? locationAlert : () => {}}
            >
              <Icon
                name="location-on"
                color={Colors.primary}
                size={Icons.medium}
              />
              <Text
                style={{
                  fontSize: Font.large,
                  color: Colors.primary
                }}
              >
                San Francisco
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            ...StyleSheet.flatten(styles.footer),
            backgroundColor: Colors.white
          }}
        >
          {(this.isUpdatedPickStart() ||
            this.isUpdatedPickEnd() ||
            this.isUpdatedDropStart() ||
            this.isUpdatedDropEnd()) && (
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
  const { index } = ownProps;
  return {
    match: matches[index],
    loading
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
    paddingVertical: Spacing.tiny,
    padding: Spacing.tiny,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: Spacing.lineWidth,
    borderColor: Colors.light,
    backgroundColor: Colors.white,
    zIndex: 3
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
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
    backgroundColor: Colors.dark,
    opacity: 0.5
  },
  footer: {
    flex: 1,
    width: "100%"
  }
});
