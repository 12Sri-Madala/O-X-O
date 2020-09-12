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
import Header from "../../Library/Native/Header";
import ProfileField from "./ProfileField";
// import EditAddress from './EditAddress';
import { Colors, Spacing, Font, Icons } from "../../Library/Native/StyleGuide";
import Loader from "../../Library/Native/Loader";
import {
  saveProfileImage,
  loadProfile,
  saveCheckr,
  saveProfileChange,
  fetchWaitlist
} from "../Redux/actions";
import OxoButton from "../../Library/Native/OxoButton";
import withErrorHandling from "../../../Containers/Native/withErrorHandling";

MAX_ADDRESSES = 4;

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingProfile: true
    };
    this.closeAddresses = this.closeAddresses.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("id");
    this.props.dispatchSaveCheckr(id, token);
    this.props.dispatchLoadProfile(id, token);
    this.props.dispatchFetchWaitlist(id, token);
  }

  async updateWaitlist() {
    const token = await AsyncStorage.getItem("token");
    const id = await AsyncStorage.getItem("id");
    this.props.dispatchFetchWaitlist(id, token);
  }

  async logout() {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("id");
    this.props.dispatchLogout();
    this.props.navigation.navigate("WelcomeScreen");
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

  // Determines which icon to display based on backgroundCheck status
  getIcon() {
    switch (this.props.checkr) {
      case "waitlist":
        return {
          checkrText: "Pending waitlist",
          color: Colors.white,
          name: "hourglass-empty"
        };
      case "clear":
        return {
          checkrText: "All Set!",
          color: Colors.white,
          name: "check"
        };
      case "consider":
        return {
          checkrText: "In Review",
          color: Colors.error,
          name: "hourglass-empty"
        };
      case "pending":
        return {
          checkrText: "Pending",
          color: Colors.secondary,
          name: "hourglass-full"
        };
      case "sent":
        return {
          checkrText: "Sent",
          color: Colors.secondary,
          name: "hourglass-empty"
        };
      default:
        return {
          checkrText: "Error",
          color: Colors.error,
          name: "error-outline"
        };
    }
  }

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
    console.log(this.props.profile);
    if (this.props.profile) profileImage = this.props.profile.profileImage;
    if (profileImage === null) {
      return <Icon name="person" size={Icons.huge} color={Colors.white} />;
    }
    if (!profileImage.includes("data:image/png;base64,")) {
      return (
        <Image
          style={styles.image}
          source={{ uri: `data:image/png;base64,${profileImage}` }}
        />
      );
    }
    return <Image style={styles.image} source={{ uri: profileImage }} />;
  }

  // Called when backgroundCheck section of Profile Page is clicked and takes appropriate reponse
  _onBackgroundCheck(backgroundCheck) {
    switch (backgroundCheck) {
      case "clear":
        Alert.alert(
          "",
          "Congratulations! Your background report has been cleared. You are ready to start driving!"
        );
        return;
      case "consider":
        Alert.alert("", "Your background check is still under review");
        return;
      case "pending":
        Alert.alert(
          "",
          "Your background check is pending. You should have received an email from Checkr. If you need assistance, please call (650) 935-5544 for help."
        );
        return;
      case "sent":
        Alert.alert(
          "",
          "Your background check is incomplete. Please complete it following the instructions sent to your email from Checkr"
        );
        return;
      default:
        Alert.alert(
          "",
          "An email with the background report application should be sent soon with further instructions. If you need assistance, please call (650) 935-5544 for help."
        );
    }
  }

  _onChangeBio(bio) {
    this.props.navigation.navigate("EditBio", { bio });
  }

  closeAddresses() {
    this.setState({
      addressesOpen: false
    });
  }

  getWaitlistStatus() {
    if (this.props.waitlist) {
      const percent =
        this.props.waitlist.percentile === 1
          ? 1
          : Math.round(this.props.waitlist.percentile * 100);
      return (
        <ProfileField
          field="Waitlist status"
          fieldValue={`Top ${percent}\% on waitlist`}
          handlePress={() => {
            this.updateWaitlist();
            this.props.navigation.navigate("Waitlist");
          }}
        />
      );
    }
  }

  tempLocations() {
    Alert.alert(
      "",
      "In the future we will use your address to better inform our matching algorithm. Until then, hang tight while we work on this feature. "
    );
  }

  render() {
    if (!this.props.loadingProfile) {
      return (
        <View style={styles.container}>
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
            <View>
              <ProfileField
                field="First name"
                fieldValue={this.props.profile.firstName}
                handlePress={this.handlePress}
              />
              <ProfileField
                field="Last name"
                fieldValue={this.props.profile.lastName}
                handlePress={this.handlePress}
              />
              <ProfileField
                field="Phone number"
                fieldValue={this.props.profile.phoneNumber}
                handlePress={this.handlePress}
              />
              <ProfileField
                field="Email"
                fieldValue={this.props.profile.email}
                icon="chevron-right"
                iconColor={Colors.white}
                handlePress={() => this.handlePress("email")}
              />
              {/* <ProfileField field="Locations" fieldValue={this.getLocations() + " locations listed"} icon="chevron-right" iconColor={Colors.white} handlePress={() => this.tempLocations()}/> */}
              <ProfileField
                field="Background check"
                fieldValue={this.getIcon().checkrText}
                icon={this.getIcon().name}
                iconColor={this.getIcon().color}
                handlePress={() => this._onBackgroundCheck(this.props.checkr)}
              />

              {this.getWaitlistStatus()}
            </View>
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
      <Loader loading={this.state.loadingProfile || this.props.loadingImage} />
    );
  }
}

const mapStateToProps = state => {
  return {
    loadingImage: state.profile.loadingImage,
    profile: state.profile.profile,
    profileImage: state.login.profileImage,
    checkr: state.profile.checkr,
    loadingProfile: state.profile.loadingProfile,
    waitlist: state.dash.waitlist
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchLogout: () => dispatch({ type: "USER_LOGOUT" }),
    dispatchLoadProfile: (id, token) => dispatch(loadProfile(id, token)),
    dispatchSaveProfileImage: base64 => dispatch(saveProfileImage(base64)),
    dispatchSaveCheckr: (id, token) => dispatch(saveCheckr(id, token)),
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
    marginTop: Spacing.small,
    borderRadius: 50
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
