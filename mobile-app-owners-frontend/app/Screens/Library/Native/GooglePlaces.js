import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors, Spacing, Icons, Font } from '../../Library/Native/StyleGuide.js';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCC2nB2SUX1l9Yh33hlj4fGhGH_oFVIZLY';
const keyValue= 'done';


export default class GooglePlaces extends React.Component {
  render() {
    return(
      <GooglePlacesAutocomplete
        textInputProps={this.props.onSubmitEditing}
        placeholder= {this.props.placeholder}
        placeholderTextColor= {this.props.placeholderTextColor}
        minLength={1} // minimum length of text to search
        autoFocus={true}
        keyboardType={'name-phone-pad'}
        returnKeyType={'done'}// Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed='true'    // true/false/undefined
        fetchDetails={false}
        isRowScrollable= {true}
        renderDescription={row => row.description} // custom description render
        onPress={
                this.props.onPress
              }

        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: GOOGLE_MAPS_APIKEY,
          language: 'en', // language of the results
        }}

        styles={{
          container:{
            flex:0,
            overflow: 'visible',
            marginTop: '15%',
          },
          listView:{
            zIndex: 100,
            backgroundColor: this.props.maincolor,
            marginLeft: -Spacing.tiny
          },
          textInputContainer: {
            overflow:'visible',
            width: '100%',
            backgroundColor: this.props.maincolor,
            borderTopColor: this.props.maincolor,
            borderBottomColor: this.props.bordercolor ? this.props.bordercolor : this.props.secondarycolor,
            borderBottomWidth: Spacing.lineWidth
          },
          textInput:{
            height:'80%',
            backgroundColor: this.props.maincolor,
            color: this.props.secondarycolor,
            fontSize: Font.title_3,
            marginLeft: -Spacing.tiny,

          },
          separator: {
            backgroundColor: this.props.maincolor,
          },
          poweredContainer:{
            opacity: '0%',
            backgroundColor: this.props.maincolor,
          },
          description: {
            overflow: 'visible',
            color: this.props.secondarycolor,
            fontSize: Font.medium,
          },
        }}
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance'
        }}

        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      />
    );
  }
}
