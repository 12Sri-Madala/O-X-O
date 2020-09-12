import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  AsyncStorage,
  Keyboard,
  Dimensions,
  Integer,
} from 'react-native';
import { connect } from 'react-redux';

// Import local components
import Header from '../../../Library/Native/Header';
import LoginTitle from '../../../Login/Native/LoginTitle';
import EditInput from '../../../Library/Native/EditInput.js';
import Loader from '../../../Library/Native/Loader';
import OxoButton from '../../../Library/Native/OxoButton.js';
import ButtonLeft from '../../../Library/Native/ButtonLeft.js';

// Import Style Guide and Language Guide
import { Colors, Font, Spacing, Icons } from '../../../Library/Native/StyleGuide.js';
import { Payments } from '../../../Library/Native/LanguageGuide.js';

import {saveVehicle } from '../../../Profile/Vehicles/Redux/actions.js';
import {Input} from "react-native-elements";


class AddVehicle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      make: null,
      model: null,
      year: null,
      color: null,
      numberSeats: null,
      numberDoors: null,
      opacity: Colors.touchedOpacity,
      buttonColor: Colors.secondary,
      displayMakeLabel: false,
      displayModelLabel: false,
      displayYearLabel: false,
      displayColorLabel: false,
      displaySeatbeltLabel: false,
      displayDoorsLabel: false,
      complete: false,
      bottomPad: 0
    }
    this.saveMakeChanges = this.saveMakeChanges.bind(this);
    this.saveModelChanges = this.saveModelChanges .bind(this);
    this.saveYearChanges =  this.saveYearChanges.bind(this);
    this.saveColorChanges = this.saveColorChanges.bind(this);
    this.saveSeatbeltChanges = this.saveSeatbeltChanges.bind(this);
    this.saveDoorsChanges = this.saveDoorsChanges.bind(this);
    this.goBack = this.goBack.bind(this);
    this.submitVehicleInfo = this.submitVehicleInfo.bind(this);
    this.checkVehicleComplete = this.checkVehicleComplete.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.state.make !== prevState.make) || (this.state.model !== prevState.model) || (this.state.year !== prevState.year) || (this.state.color !== prevState.color) || (this.state.numberSeats !== prevState.numberSeats) || (this.state.numberDoors !== prevState.numberDoors) ) {
      this.checkVehicleComplete();
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

  async submitVehicleInfo() {
    const ownerId = await AsyncStorage.getItem('id');
    const vehicle = {
      ownerID: ownerId,
      make: this.state.make,
      model: this.state.model,
      year: this.state.year,
      color: this.state.color,
      numberSeats: this.state.numberSeats,
      numberDoors: this.state.numberDoors,
    }
    console.log(vehicle);
    const nav = this.props.navigation
    Keyboard.dismiss()
    this.props.dispatchSaveVehicle(vehicle, nav);
  }

  checkVehicleComplete() {
    if (this.state.make != null && this.state.model != null && this.state.year != null && this.state.color != null && this.state.numberSeats != null && this.state.numberDoors != null) {
      if(!Number.isNaN(Number(this.state.year)) && !Number.isNaN(Number(this.state.numberSeats)) && !Number.isNaN(Number(this.state.numberDoors)) ){
        this.setState({
          buttonColor: Colors.secondary,
          opacity: 1,
          complete: true,
        });
      }
    }
  }

  saveMakeChanges(value) {
    this.setState({
      make: value,
      displayMakeLabel: true,
    });
  }

  saveModelChanges(value) {
    this.setState({
      model: value,
      displayModelLabel: true
    });
  }

  saveYearChanges(value) {
    this.setState({
      year: value,
      displayYearLabel: true
    });
  }

  saveColorChanges(value) {
    this.setState({
      color: value,
      displayColorLabel: true
    });
  }

  saveDoorsChanges(value) {
    this.setState({
      numberDoors: value,
      displayDoorsLabel: true
    });
  }

  saveSeatbeltChanges(value) {
    this.setState({
      numberSeats: value,
      displaySeatbeltLabel: true
    });
  }

  goBack() {
    this.props.navigation.navigate('Vehicles');
  }

  render() {
    return (
      <View style={styles.screenContainer}>
      <View style={{height:'11%', width: '100%'}}>
      <Header
        icon='chevron-left'
        title='Add vehicle'
        _callback={() => this.props.navigation.navigate('VehiclesList')}
      />
      </View>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>{'Tell us about your car'}</Text>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        placeholder="Car make"
        displayLabel={this.state.displayMakeLabel}
        label='Make'
        onChangeText={this.saveMakeChanges}>
      </EditInput>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        placeholder="Car model"
        displayLabel={this.state.displayModelLabel}
        label='Model'
        onChangeText={this.saveModelChanges}>
      </EditInput>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        placeholder="Car year"
        displayLabel={this.state.displayYearLabel}
        label='Year'
        onChangeText={this.saveYearChanges}></EditInput>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        placeholder="Car color"
        displayLabel={this.state.displayColorLabel}
        label='Color'
        onChangeText={this.saveColorChanges}></EditInput>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        placeholder="# of seatbelts"
        displayLabel={this.state.displaySeatbeltLabel}
        label='# of seatbelts'
        onChangeText={this.saveSeatbeltChanges}></EditInput>
      <EditInput
        placeholderTextColor = {Colors.primary}
        selectionColor={Colors.primary}
        labelStyle={styles.labelText}
        inputStyle={styles.valueText}
        placeholder="# of doors"
        displayLabel={this.state.displayDoorsLabel}
        label='# of doors'
        onChangeText={this.saveDoorsChanges}></EditInput>
      <ButtonLeft
        opacity={this.state.opacity}
        color={this.state.buttonColor}
        _callBack={ this.state.complete ? this.submitVehicleInfo : () => {} }
        icon='chevron-right'
        title='NEXT'
        relative={true}>
      </ButtonLeft>
      <View style={{height: this.state.bottomPad}}/>
      </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicle: state.vehicles,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchSaveVehicle: (vehicle, nav) => {dispatch(saveVehicle(vehicle, nav)) } ,
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddVehicle);

const styles = StyleSheet.create({
  inputs:{
    flex:1
  },
  labelText: {
    fontSize: Font.regular,
    color: Colors.primary,
    paddingVertical: Spacing.tiny,
  },
  valueText: {
    width: '100%',
    fontSize: Font.title_3,
    color: Colors.primary,

  },
  container: {
    backgroundColor: Colors.white,
    width: "100%",
  },
  screenContainer: {
    height:'100%',
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
  },
  scroll: {
    backgroundColor: Colors.white,
  },
  titleContainer: {
    paddingLeft: Spacing.small,
    paddingRight: Spacing.small,
    marginTop: Spacing.base,
    flex: 0,
    width: '100%',
    justifyContent: 'flex-start',
  },
  title: {
    color: Colors.primary,
    fontSize: Font.title_3,
    marginTop: Spacing.base,
      marginLeft: Spacing.small,

  },
  valueContainer: {
    borderWidth: Spacing.lineWidth,
    borderRadius: Spacing.small
  }
});
