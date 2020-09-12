/*
This page is accessed from the Payment page and allows the user to input a new credit card.
Uses CreditCardInput from a third party to allow for capture of the credit card information
and then uses Google Cloud functions to update the Stripe database with the new card/customer.
*/

// Import components from React and React Native
import React from 'react';
import {StyleSheet, Text, View, Image, Alert, TouchableOpacity, AsyncStorage, Keyboard} from 'react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { connect } from 'react-redux';

// Import local components
import Header from '../../Library/Native/Header';
import Loader from '../../Library/Native/Loader';
import OxoButton from '../../Library/Native/OxoButton';
import withErrorHandling from '../../../Containers/Native/withErrorHandling';

// Import Style Guide
import {
  Colors,
  Font,
  Spacing
} from '../../Library/Native/StyleGuide';

// Import Redux Actions
import {
  sendToken,
  createCustomer,
  addCardToUser,
  getCustomerID,
  clearError,
} from '../Redux/actions';

// Import Redux Actions
import {
  updateData,
} from '../../Library/Redux/actions';

/*
Stripe public key which is used to add credit cards to a user's account.
The secret key is ONLY stored in Firebase/Google Cloud functions
*/
var stripePK = require('stripe-client')('pk_test_7Hatfb7bdJuKHTHwdusk2R1L');

/*
Information on the user so as to add a new card to an existing account.
Will be moved to the state once Redux is implemented
*/
var customerInformation = {
  customer: {
    id: null,
  },
  userId: null,
  userToken: null,
}

class NewCardPage extends React.Component {
  /*
  The state contains information on the credit card which is updated as the user types.
  Information is cleared after the user submits the information to Stripe.
  Also contains loading for the loading wheel which prevents multiple submissions of the
  same card and binding for two methods which need to access the state.
  */
  constructor(props){
    super(props);
    this.state = {
      allFieldsValid: false,
      cardNumber: null,
      cardNumberValid: false,
      cardType: null,
      expirationDate: null,
      expirationDateValid: false,
      cvc: null,
      cvcValid: false,
      postalCode: null,
      postalCodeValid: false,
      loading: false,
      name: null,
      nameValid: false
    };
    this._onChange = this._onChange.bind(this);
  }

  async getItem(key) {
    try {
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        var jsonOfItem = await AsyncStorage.getItem(key);
        return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  async componentDidMount(){
    customerInformation.userId = await this.getItem('id')
    customerInformation.userToken = await this.getItem('token')
    const res = await this.props.dispatchGetCustomerID(customerInformation.userId, customerInformation.userToken)
    if (res.customerID !== null){
      customerInformation.customer.id = res.customerID
    }
  }

  componentDidUpdate() {
    if (this.props.error != null) {
      Alert.alert(
        'Error.',
        'Please try again.' + this.props.error,
      );
      this.props.dispatchClearError();
    }
  }

  /*
  Description: Called when the user clicks Add Card. Adds a card to the user's Stripe account if
               it exists, otherwise it creates a new Stripe account and adds the card to it. Also
               provides basic checking to see if the card is valid
  Arguments: All arguments taken from the state which is updated as the user types
  Returns: N/A but card should be added to Stripe and state and the user sent back to Payments page
  */
  async addCard(){
    // Use loader to prevent double clicking
    this.setState({
      loading: true,
    })
    // If card is valid then create card object and send to Stripe to get a token
    if (this.state.cardNumberValid === 'valid' && this.state.expirationDateValid === 'valid'
       && this.state.cvcValid === 'valid' && this.state.postalCode.length === 5){
      var information = {
        card: {
          number: this.state.cardNumber,
          exp_month: this.state.expirationDate.slice(0,2),
          exp_year: this.state.expirationDate.slice(3,5),
          cvc: this.state.cvc,
          name: this.state.name,
        },
      }
      var cardData = await this.props.dispatchSendToken(information);
      var cardToken = cardData.id;

      /*
      If not an existing customer then create a new customer and store the ID. Otherwise
      add card to the existing customer
      */
      if (customerInformation.customer.id === null) {
        let createCustomerInformation = { token: cardToken, name: this.state.name }
        var customerObject = await this.props.dispatchCreateCustomer(customerInformation.userId, customerInformation.userToken, createCustomerInformation);
        if (customerObject.id !== undefined){
          customerInformation.customer.id = customerObject.id;
          await this.props.dispatchUpdateData({customerID: customerInformation.customer.id}, customerInformation.userId, customerInformation.userToken)
          this.setState({
              loading: false,
          });
          this.clearCustomerCardInfo();
          this.props.navigation.navigate('Payment');
        } else{
          Alert.alert(
            "Card Error",
            "You are most likely seeing this error because you tried to add a real credit card.  " +
            "We aren't accepting live payments at the moment.  If you want to test functionality try using\n" +
            "4242 4242 4242 4242 or \n 6011 1111 1111 1117\n as the card number with any expiration date/CVC!"
          )
          this.setState({
            loading: false,
          })
          this.clearCustomerCardInfo();
          this.props.navigation.navigate('Payment')
        }
      } else{
          console.log(customerInformation);

          var existingCustomerObject = await this.props.dispatchAddCardToUser(customerInformation.userId, customerInformation.userToken, cardToken, customerInformation.customer.id);
          console.log("Add card to customer " + this.state.name + ": " + customerInformation.customer.id)
          if (existingCustomerObject.success) {
              this.clearCustomerCardInfo();
              this.props.navigation.navigate('Payment')
          } else {
              Alert.alert(
                  'Error adding card info.',
                  'Please update and try again.',
                  [{text: 'Ok', onPress: () => this.setState({loading: false})}]
              );
          }
      }

      // this.props.navigation.navigate('Payment', {last4: cardData.card.last4, brand: cardData.card.brand, card: cardData.id, customer: customerInformation.customer.id})
    } else {
      this.setState({
        loading: false,
      })
      Alert.alert(
        'Error adding card info.',
        'Please update and try again.'
      )
    }
  }

  /*
  Description: Clear customer's card information from the state for security purposes
  */
  clearCustomerCardInfo(){
    this.setState({
      allFieldsValid: false,
      name: null,
      nameValid: false,
      cardNumber: null,
      cardNumberValid: false,
      cardType: null,
      expirationDate: null,
      expirationDateValid: false,
      cvc: null,
      cvcValid: false,
      postalCode: null,
      postalCodeValid: false,
      loading: false,
    });
  }

  /*
  Description: Part of the CreditCardInput object which updates each time the user types a new digit
  Arguments: formData => Information scraped from the fields being filled out by the customer along with
                         fields checking whether the numbers being input are valid
  Returns: N/A
  */
  _onChange(formData){
    this.setState({
      name: formData.values.name,
      nameValid: formData.status.name,
      allFieldsValid: formData.valid,
      cardNumber: formData.values.number,
      cardNumberValid: formData.status.number,
      cardType: formData.values.type,
      expirationDate: formData.values.expiry,
      expirationDateValid: formData.status.expiry,
      cvc: formData.values.cvc,
      cvcValid: formData.status.cvc,
      postalCode: formData.values.postalCode,
      postalCodeValid: formData.status.postalCode,

    });
    if(this.state.name === 'valid' && this.state.cardNumberValid === 'valid' && this.state.expirationDateValid === 'valid'
    && this.state.cvcValid === 'valid' && (this.state.postalCode.length === 5)){
      console.log("dismiss keyboard")
      Keyboard.dismiss();
    }
  }

  render() {
    return(
      <View style={{backgroundColor: Colors.white, height:'100%'}}>
        {<View style={styles.header}>
          <Header
            icon='chevron-left'
            title='Add Card'
            _callback={() => this.props.navigation.navigate('Payment')}
          />
    </View>}
        <View style={styles.cardContainer}>
          {/*Object which records the user's credit card information*/}
          <CreditCardInput
            onChange={this._onChange}
            requiresPostalCode
            requiresName
          />
          <Loader loading={this.state.loading} />
          <View style={{alignItems: 'center', flex: .5, flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <OxoButton
            type={'outline'}
            buttonSize={'large'}
            fontSize={'medium'}
            content={'Add Card'}
            color={'primary'}
            onPress={() => this.addCard()}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.payments.loading,
    customerID: state.payments.customerID,
    cards: state.payments.cards,
    defaultCard: state.payments.defaultCard,
    error: state.payments.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatchSendToken: (information) => dispatch(sendToken(information)),
    dispatchCreateCustomer: (id, token, information) => dispatch(createCustomer(id, token, information)),
    dispatchAddCardToUser: (id, token, card, customerID) => dispatch(addCardToUser(id, token, card, customerID)),
    dispatchGetCustomerID: (userId, userToken) => dispatch(getCustomerID(userId, userToken)),
    dispatchUpdateData: (data, id, token) => dispatch(updateData(data, id, token)),
    dispatchClearError: () => dispatch(clearError()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandling(NewCardPage));

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.base,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  cardContainer: {
    marginTop: Spacing.small,
    backgroundColor: 'white',
    borderRadius: Spacing.base,
    borderColor: 'white',
    borderWidth: Spacing.tiny,
    width: '100%',
    height: '75%',
  },

});


// import React, { Component } from 'react';
// import { View } from 'react-native';
// import stripe from 'tipsi-stripe';

// stripe.setOptions({
//   publishableKey: 'pk_test_7Hatfb7bdJuKHTHwdusk2R1L',
//   androidPayMode: 'test',
// });

// const theme = {
//   primaryBackgroundColor: '#1e88e5',
//   secondaryBackgroundColor: '#005cb2',
//   primaryForegroundColor: '#ff867f',
//   secondaryForegroundColor: '#ff5252',
//   accentColor: '#6ab7ff',
//   errorColor: '#6ab7ff'
// };

// export default class NewCardPage extends Component {
//   componentDidMount() {
//     stripe.paymentRequestWithCardForm(options)
//       .then(response => {
//         console.log("Payment Processed")
//       })
//       .catch(error => {
//         console.log('error: ' + error)
//       });
//   }

//   render() {
//     return <View/>
//   }
// }
