// Import components from React and React Native
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";

// Import components from separate Node modules
import { Icon } from "react-native-elements";

// Import library components
import { Colors, Icons, Spacing, Font } from "../../Library/Native/StyleGuide";

// Import helpers
import { contact, message } from "../../Dash/Native/MatchFoundHelpers";
import { messageOwner } from "../../Dash/Redux/actions";
import { sbGetChannelTitle } from "../../Chat/sendbirdActions";

class DriverDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: null, token: null };
  }

  async componentDidMount() {
    const id = await AsyncStorage.getItem("id");
    const token = await AsyncStorage.getItem("token");
    this.setState({ id, token });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1 /* Colors.touchedOpacity */}
          onPress={() => {}}
          style={{
            ...StyleSheet.flatten(styles.block),
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Icon
            name="directions-car"
            size={Icons.x_large}
            color={Colors.primary}
          />
          <Text style={{ color: Colors.primary, fontSize: Font.regular }}>
            {`${this.props.car.make} ${this.props.car.model}`}
          </Text>
          <Text style={{ color: Colors.primary, fontSize: Font.regular }}>
            {`${this.props.car.plateNumber}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1 /* Colors.touchedOpacity */}
          onPress={() => {}}
          style={{
            ...StyleSheet.flatten(styles.block),
            alignItems: "center"
          }}
        >
          {this.props.driver.profileImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: this.props.driver.profileImage }}
                style={{
                  height: 2 * Icons.large,
                  width: 2 * Icons.large,
                  borderRadius: Icons.large
                }}
              />
            </View>
          ) : (
            <View style={styles.imageStandIn}>
              <Icon name="person" size={Icons.large} color={Colors.primary} />
            </View>
          )}

          <Text style={{ color: Colors.primary, fontSize: Font.large }}>
            {`${this.props.driver.firstName} ${this.props.driver.lastName[0]}.`}
          </Text>
          <Text style={{ color: Colors.primary, fontSize: Font.large }} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={Colors.touchedOpacity}
          onPress={() => {
            this.props.dispatchMessageOwner(this.props.driver.id);
          }}
          style={{
            ...StyleSheet.flatten(styles.block),
            justifyContent: "center",
            alignItems: "flex-end"
          }}
        >
          <Icon name="message" size={Icons.x_large} color={Colors.primary} />
          <Text style={{ color: Colors.primary, fontSize: Font.regular }}>
            Message
          </Text>
          <Text style={{ color: Colors.primary, fontSize: Font.regular }}>
            Driver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// const mapStateToProps = state => {
//     return {
//         channel: state.dash.channel
//     }
// }

const mapDispatchToProps = dispatch => {
  return {
    dispatchMessageOwner: id => dispatch(messageOwner(id))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(DriverDetails);

const styles = StyleSheet.create({
  container: {
    flex: 5,
    width: Dimensions.get("window").width - 2 * Spacing.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  block: {
    flex: 1,
    height: "100%"
  },
  imageContainer: {
    overflow: "hidden",
    height: 2 * Icons.large,
    width: 2 * Icons.large,
    borderRadius: Icons.large
  },
  imageStandIn: {
    height: 2 * Icons.large,
    width: 2 * Icons.large,
    borderWidth: Spacing.lineWidth,
    borderColor: Colors.primary,
    borderRadius: 100,
    justifyContent: "center"
  }
});
