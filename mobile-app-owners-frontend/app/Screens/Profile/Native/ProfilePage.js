/* This is a very convoluted screen encapsulating the profile page
screen for drivers. This screen is still under development and needs
to be decomposed into multiple files. It handles saving and adding user
locations, updating biographies, changing profile pictures, and beginning
driver background checks.
*/

// Import components from React and React Native
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  AsyncStorage,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { connect } from "react-redux";

// Import elements from separate Node modules
import { Icon } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

// Import local components
import { NavigationEvents } from "react-navigation";
import Header from "../../Library/Native/Header";
import ProfileField from "./ProfileField";
import {
  Colors,
  Spacing,
  Font,
  Icons
} from "../../Library/Native/StyleGuide.js";
import Loader from "../../Library/Native/Loader.js";
import {
  saveProfileImage,
  saveProfileChange,
  fetchWaitlist,
  loadProfile
} from "../Redux/actions";
import OxoButton from "../../Library/Native/OxoButton.js";
import withErrorHandling from "../../../Containers/Native/withErrorHandling";
import serverInfo from "../../../Resources/serverInfo";
import { loadVehicles } from "../Vehicles/Redux/actions";
import { loadAddresses } from "../Addresses/Redux/actions";

MAX_ADDRESSES = 4;

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImage: null,
      addressesStatus: false,
      addAddress: false,
      loadingProfile: true
    };
    this.closeAddresses = this.closeAddresses.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.logout = this.logout.bind(this);
    this.getLocations = this.getLocations.bind(this);
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("id");
    this.props.dispatchLoadProfile(id, token);
    this.props.dispatchLoadVehicles(id, token);
    this.props.dispatchFetchWaitlist(id, token);

    this.setState({
      id,
      token
    });
    this.props.dispatchLoadAddresses(id, token);
  }

  updateWaitlist = async () => {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("id");
    this.props.dispatchFetchWaitlist(id, token);
  };

  async logout() {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("id");
    this.props.dispatchLogout();
    this.props.navigation.navigate("WelcomeScreen");
  }

  onIconPress = () => {
    Alert.alert(
      "",
      "If you would like to edit this information you must contact an OXO representative at (650) 935-5544."
    );
  };

  async editImage() {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result;
    Alert.alert(
      "Select profile picture",
      "",
      [
        {
          text: "Photo Library",
          onPress: async () => {
            result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              quality: 0.1,
              base64: true
            });
            if (!result.cancelled) {
              const token = await AsyncStorage.getItem("token");
              const id = await AsyncStorage.getItem("id");
              await this.props.dispatchSaveProfileImage({
                token,
                id,
                payload: { base64: result.base64 }
              });
              const profileImage = `data:image/png;base64,${result.base64}`;
              await this.setState({
                profileImage
              });
            }
          }
        },
        {
          text: "Camera",
          onPress: async () => {
            result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.1,
              base64: true
            });
            if (!result.cancelled) {
              const token = await AsyncStorage.getItem("token");
              const id = await AsyncStorage.getItem("id");
              await this.props.dispatchSaveProfileImage({
                token,
                id,
                payload: { base64: result.base64 }
              });
              const profileImage = `data:image/png;base64,${result.base64}`;
              await this.setState({
                profileImage
              });
            }
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  }

  getProfilePicture() {
    let profileImage = null;
    if (this.props.profile) profileImage = this.props.profile.profileImage;
    if (profileImage === null) {
      return (
        <Icon
          name="person"
          containerStyle={styles.bigIconContainer}
          size={Icons.huge}
          color={Colors.primary}
        />
      );
    }
    if (!profileImage.includes("data:image/png;base64,")) {
      return (
        <Image
          style={styles.image}
          source={{ uri: `data:image/png;base64,${  profileImage}` }}
        />
      );
    }
    return <Image style={styles.image} source={{ uri: profileImage }} />;
  }

  onChangeBio(bio) {
    this.props.navigation.navigate("EditBio", { bio });
  }

  getLocations() {
    if (this.props.addresses === null) {
      return 0;
    }
    return Object.keys(this.props.addresses).length;
  }

  closeAddresses() {
    this.setState({
      addressesOpen: false
    });
  }

  tempLocations() {
    Alert.alert(
      "",
      "In the future we will use your address to better inform our matching algorithm. Until then, hang tight while we work on this feature. "
    );
  }

  async handleFieldUpdate(field, value) {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("id");
    const update = {};
    update[field] = value;
    this.props.dispatchSaveProfileChange(update, id, token);
    this.props.navigation.navigate("ProfilePage");
  }

  handlePress(source) {
    if (source === "email") {
      this.props.navigation.navigate("EditProfileFieldScreen", {
        placeholder: "Update email address",
        label: "Email",
        handleChange: email => this.handleFieldUpdate("email", email)
      });
    } else {
      Alert.alert(
        "",
        "If you would like to edit this information you must contact an OXO representative at (650) 935-5544."
      );
    }
  }

  getWaitlistStatus() {
    const { waitlist } = this.props;
    if (waitlist) {
      const percent =
        waitlist.percentile === 1
          ? 1
          : Math.round((1 - waitlist.percentile) * 100);
      return (
        <ProfileField
          field="Waitlist status"
          fieldValue={`Top ${percent}% on waitlist`}
          handlePress={() => {
            this.updateWaitlist();
            this.props.navigation.navigate("Waitlist");
          }}
        />
      );
    }
    return null;
  }

  render() {
    if (this.props.profile) {
      return (
        <View style={styles.container}>
          {this.state.id && this.state.token && (
            <NavigationEvents
              onWillFocus={payload =>
                this.props.dispatchLoadVehicles(this.state.id, this.state.token)
              }
            />
          )}
          <View style={{ width: "100%", height: "11%" }}>
            <Header
              _call={() => {
                this.props.navigation.navigate("Dashboard");
              }}
            />
          </View>
          <ScrollView style={styles.scroll} directionalLockEnabled>
            <View style={styles.screenContainer}>
              <View style={styles.imageContainer}>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginRight: Spacing.large
                  }}
                >
                  {this.getProfilePicture()}
                  <View style={styles.iconContainer}>
                    <Icon
                      reverse
                      name="edit"
                      size={Icons.small}
                      color={Colors.secondary}
                      raised
                      reverseColor={Colors.white}
                      onPress={() => this.editImage()}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.title}> Your Profile </Text>
            </View>
            <ProfileField
              field="First name"
              fieldValue={this.props.profile.firstName}
              iconColor={Colors.white}
              handlePress={this.onIconPress}
            />
            <ProfileField
              field="Last name"
              fieldValue={this.props.profile.lastName}
              iconColor={Colors.white}
              handlePress={this.onIconPress}
            />
            <ProfileField
              field="Phone number"
              fieldValue={this.props.profile.phoneNumber}
              iconColor={Colors.white}
              handlePress={this.onIconPress}
            />
            <ProfileField
              field="Email"
              fieldValue={this.props.profile.email}
              icon="chevron-right"
              iconColor={Colors.white}
              handlePress={() => this.handlePress("email")}
            />
            <ProfileField
              field="Locations"
              fieldValue={
                this.getLocations() +
                (this.getLocations() === 1
                  ? " location listed"
                  : " locations listed")
              }
              icon="chevron-right"
              iconColor={Colors.white}
              handlePress={() => this.props.navigation.navigate("LocationList")}
            />

            <ProfileField
              field="Vehicles"
              fieldValue={
                Object.keys(this.props.vehicles).length +
                (this.props.vehicles === 1
                  ? " vehicle listed"
                  : " vehicles listed")
              }
              icon="chevron-right"
              iconColor={Colors.white}
              handlePress={() => this.props.navigation.navigate("VehiclesList")}
            />
            {this.getWaitlistStatus()}
            <TouchableOpacity
              style={styles.logoutContainer}
              onPress={() => this.logout()}
            >
              <Text style={{ color: Colors.secondary, fontSize: 20 }}>
                Logout
              </Text>
            </TouchableOpacity>
            <View style={{ height: Spacing.small }} />
          </ScrollView>
        </View>
      );
    }

    return (
      <Loader loading={this.props.loadingProfile || this.props.loadingImage} />
    );
  }
}

const mapStateToProps = state => {
  return {
    loadingImage: state.profile.loadingImage,
    profile: state.profile.profile,
    profileImage: state.profile.profileImage,
    addresses: state.addresses.addresses,
    vehicles: state.vehicles.vehicles,
    waitlist: state.dash.waitlist
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogout: () => dispatch({ type: "USER_LOGOUT" }), // Special case to wipe store
    dispatchLoadAddresses: (id, token) => dispatch(loadAddresses(id, token)),
    dispatchSaveProfileImage: base64 => {
      dispatch(saveProfileImage(base64));
    },
    dispatchLoadVehicles: (id, token) => dispatch(loadVehicles(id, token)),
    dispatchLoadProfile: (id, token) => dispatch(loadProfile(id, token)),
    dispatchSaveProfileChange: (update, id, token) =>
      dispatch(saveProfileChange(update, id, token)),
    dispatchFetchWaitlist: (id, token) => dispatch(fetchWaitlist(id, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandling(ProfilePage));

const styles = StyleSheet.create({
  icon: {
    marginLeft: Spacing.tiny // hard coded, bad solution for now, change later
  },
  header: {
    paddingTop: Spacing.base,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary
  },
  title: {
    color: Colors.white,
    fontSize: Font.title_3,
    position: "absolute",
    margin: Spacing.base
  },
  iconContainer: {
    width: 150,
    alignItems: "flex-end",
    marginTop: -40,
    marginLeft: 5
  },
  image: {
    overflow: "hidden",
    backgroundColor: Colors.primary,
    borderRadius: 65,
    width: 130,
    height: 130,
    marginLeft: 55
  },
  imageContainer: {
    justifyContent: "flex-end"
  },
  logoutContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: Colors.light,
    marginTop: Spacing.small
    // borderRadius: 50,
  },
  container: {
    height: "100%",
    alignItems: "center",
    backgroundColor: Colors.primary
  },
  scroll: {
    backgroundColor: Colors.primary
  }
});

{
  /* <ProfileField field='Bio' fieldValue={this.state.biography} icon='chevron-right' iconColor={Colors.white} handlePress={() => this._onChangeBio(this.state.biography) }/> */
}
