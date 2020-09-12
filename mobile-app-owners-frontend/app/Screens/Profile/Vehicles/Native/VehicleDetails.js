import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  AsyncStorage,
  Keyboard
} from "react-native";
import { connect } from "react-redux";

// Import local components
import Header from "../../../Library/Native/Header";
import EditInput from "../../../Library/Native/EditInput";
import ButtonLeft from "../../../Library/Native/ButtonLeft";

// Import Style Guide and Language Guide
import { Colors, Font, Spacing } from "../../../Library/Native/StyleGuide";
import { saveLicense } from "../Redux/actions";

class VehicleDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plateNumber: null,
      VIN: null,
      licenseState: null,
      opacity: Colors.touchedOpacity,
      buttonColor: Colors.secondary,
      displayPlateLabel: false,
      displayVINLabel: false,
      displayStateLabel: false,
      complete: false,
      bottomPad: 0
    };
    this.savePlateChanges = this.savePlateChanges.bind(this);
    this.saveVINChanges = this.saveVINChanges.bind(this);
    this.saveStateChanges = this.saveStateChanges.bind(this);
    this.goBack = this.goBack.bind(this);
    this.submitLicenseInfo = this.submitLicenseInfo.bind(this);
    this.checkLicenseComplete = this.checkLicenseComplete.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
  }

  async componentDidMount() {
    const { vehicles, navigation } = this.props;
    const nav = navigation;
    if (nav.getParam("index")) {
      const index = nav.getParam("index");
      if (index in vehicles) {
        if (vehicles[index].plateNumber)
          this.savePlateChanges(vehicles[index].plateNumber);
        if (vehicles[index].vin) this.saveVINChanges(vehicles[index].vin);
        if (vehicles[index].licenseState)
          this.saveStateChanges(vehicles[index].licenseState);
      }
    }
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { plateNumber, VIN, licenseState } = this.state;
    if (
      plateNumber !== prevState.plateNumber ||
      VIN !== prevState.VIN ||
      licenseState !== prevState.licenseState
    ) {
      this.checkLicenseComplete();
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    this.setState({
      bottomPad: e.endCoordinates.height
    });
  }

  keyboardDidHide(e) {
    this.setState({
      bottomPad: 0
    });
  }

  async submitLicenseInfo() {
    const { plateNumber, VIN, licenseState } = this.state;
    const ownerId = await AsyncStorage.getItem("id");
    const vehicle = {
      ownerId,
      plateNumber,
      vin: VIN,
      licenseState
    };
    const nav = this.props.navigation;
    Keyboard.dismiss();
    this.props.dispatchSaveLicense(vehicle, nav, nav.getParam("index", null));
  }

  checkLicenseComplete() {
    const { plateNumber, VIN, licenseState } = this.state;
    if (plateNumber != null && VIN != null && licenseState != null) {
      this.setState({
        buttonColor: Colors.secondary,
        opacity: 1,
        complete: true
      });
    }
  }

  savePlateChanges(value) {
    this.setState({
      plateNumber: value,
      displayPlateLabel: true
    });
  }

  saveVINChanges(value) {
    this.setState({
      VIN: value,
      displayVINLabel: true
    });
  }

  saveStateChanges(value) {
    this.setState({
      licenseState: value,
      displayStateLabel: true
    });
  }

  goBack() {
    this.props.navigation.navigate("AddVehicle");
  }

  render() {
    const {
      plateNumber,
      VIN,
      licenseState,
      displayPlateLabel,
      displayVINLabel,
      displayStateLabel,
      opacity,
      buttonColor,
      complete,
      bottomPad
    } = this.state;

    const { screenContainer, labelText, valueText, title } = styles;
    return (
      <View style={screenContainer}>
        <View style={{ height: "11%", width: "100%" }}>
          <Header
            icon="chevron-left"
            title="Vehicle details"
            _callback={() =>
              this.props.navigation.navigate(
                this.props.navigation.getParam("before", "AddVehicle")
              )
            }
          />
        </View>
        <ScrollView style={{ backgroundColor: Colors.white, width: "100%" }}>
          <Text style={title}>License info</Text>
          {/* <View style={styles.inputs}> */}
          <EditInput
            // errorMessage={'Required'}
            // hideError={this.props.emptyFirstName}
            placeholderTextColor={Colors.primary}
            selectionColor={Colors.primary}
            labelStyle={labelText}
            inputStyle={valueText}
            placeholder={plateNumber || "Enter license plate number"}
            displayLabel={displayPlateLabel}
            label="License plate"
            onChangeText={this.savePlateChanges}
          />
          <EditInput
            // errorMessage={'Required'}
            // hideError={this.props.emptyFirstName}
            placeholderTextColor={Colors.primary}
            selectionColor={Colors.primary}
            labelStyle={labelText}
            inputStyle={valueText}
            placeholder={VIN || "Enter car VIN number"}
            displayLabel={displayVINLabel}
            label="VIN"
            onChangeText={this.saveVINChanges}
          />
          <EditInput
            // errorMessage={'Required'}
            // hideError={this.props.emptyLastName}
            placeholderTextColor={Colors.primary}
            selectionColor={Colors.primary}
            labelStyle={labelText}
            inputStyle={valueText}
            placeholder={licenseState || "Enter license state"}
            displayLabel={displayStateLabel}
            label="State"
            onChangeText={this.saveStateChanges}
          />
          {/* </View> */}

          <ButtonLeft
            opacity={opacity}
            color={buttonColor}
            _callBack={complete ? this.submitLicenseInfo : () => {}}
            icon="chevron-right"
            title="SAVE"
            relative
          />
        </ScrollView>
        <View style={{ height: bottomPad }} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicles: state.vehicles.vehicles
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSaveLicense: (vehicle, nav, id) => {
      dispatch(saveLicense(vehicle, nav, id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VehicleDetails);

const styles = StyleSheet.create({
  inputs: {
    flex: 1
  },
  labelText: {
    // width: '100%',
    fontSize: Font.regular,
    color: Colors.primary,
    paddingVertical: Spacing.tiny
  },
  valueText: {
    width: "100%",
    fontSize: Font.title_3,
    color: Colors.primary
  },
  screenContainer: {
    height: "100%",
    width: "100%",
    // flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white
  },
  scroll: {
    backgroundColor: Colors.white
  },
  titleContainer: {
    // paddingLeft: Spacing.small,
    // paddingRight: Spacing.small,
    marginTop: Spacing.base,
    marginLeft: "5%",
    flex: 0,
    width: "100%",
    justifyContent: "flex-start"
  },
  title: {
    color: Colors.primary,
    fontSize: Font.title_3,
    marginTop: Spacing.base,
    marginLeft: "5%"
  }
});
