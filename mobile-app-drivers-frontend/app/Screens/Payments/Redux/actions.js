import { Alert } from 'react-native';

import {
  SEND_TOKEN_STARTED,
  SEND_TOKEN_SUCCESS,
  SEND_TOKEN_FAILURE,
  CREATE_CUSTOMER_STARTED,
  CREATE_CUSTOMER_SUCCESS,
  CREATE_CUSTOMER_FAILURE,
  ADD_CARD_TO_USER_STARTED,
  ADD_CARD_TO_USER_FAILURE,
  GET_DEFAULT_CARD_STARTED,
  GET_DEFAULT_CARD_SUCCESS,
  GET_DEFAULT_CARD_FAILURE,
  DELETE_CARD_STARTED,
  DELETE_CARD_FAILURE,
  CHANGE_DEFAULT_CARD_STARTED,
  CHANGE_DEFAULT_CARD_SUCCESS,
  CHANGE_DEFAULT_CARD_FAILURE,
  MAKE_PAYMENT_STARTED,
  MAKE_PAYMENT_SUCCESS,
  MAKE_PAYMENT_FAILURE,
  GET_CUSTOMER_ID_STARTED,
  GET_CUSTOMER_ID_SUCCESS,
  GET_CUSTOMER_ID_FAILURE,
  GET_CARDS_STARTED,
  GET_CARDS_SUCCESS,
  GET_CARDS_FAILURE,
  CLEAR_ERROR_STARTED,
  CLEAR_ERROR_SUCCESS,
  CLEAR_ERROR_FAILURE,
} from './types';


import serverInfo from '../../../Resources/serverInfo';

const stripePK = require('stripe-client')(serverInfo.stripePublicKey)

export function clearError() {
  return (dispatch) => {
    dispatch(clearErrorSuccess());
  }
}


function clearErrorSuccess() {
  return {
    type: CLEAR_ERROR_SUCCESS,
  }
}

export function getCards(userId, token, customerID) {
  return async (dispatch) => {
    dispatch(getCardsStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/getCards/${userId}/${token}/${customerID}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "GET"
      })
      if (!response.ok) {
        dispatch(getCardsFailure(response.statusText));
        return null;
      }
      // Parse the response so you can access the fields in it
      const cards = await response.json();
      dispatch(getCardsSuccess(cards));
      return cards;
    } catch(error) {
      console.log(error)
      dispatch(getCardsFailure(error));
      return null;
    }
  }
}

function getCardsStarted() {
  return {
    type: GET_CARDS_STARTED
  }
}

function getCardsSuccess(cardInfo) {
  let cards = cardInfo.cards;
  let defaultCard = cardInfo.defaultCard;
  console.log(cardInfo)
  let cardsSparse =  [];
  for (var i = 0; i < cards.length; i++){
    sparseCard = {type: cards[i].brand, digits: cards[i].last4, expMonth: cards[i].exp_month, expYear: cards[i].exp_year, token: cards[i].id}
    cardsSparse.push(sparseCard)
  }
  return {
    type: GET_CARDS_SUCCESS,
    payload: {
      cards: cardsSparse,
      defaultCard: defaultCard,
    }
  }
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function getCardsFailure(error) {
  return {
    type: GET_CARDS_FAILURE,
    payload: {
      error: error
    }
  }
}

export function getCustomerID(id, token){
  return async (dispatch) => {
    dispatch(getCustomerIDStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/getCustomerID/${id}/${token}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: "GET"
      })
      // Parse the response so you can access the fields in it
      const customerIDObj = await response.json();
      dispatch(getCustomerIDSuccess(customerIDObj));
      return customerIDObj;
    } catch(error) {
      console.log(error)
      dispatch(getCustomerIDFailure(error));
      return null;
    }
  }
}

function getCustomerIDStarted() {
  return {
    type: GET_CUSTOMER_ID_STARTED
  }
}

function getCustomerIDSuccess(customerID) {
  return {
    type: GET_CUSTOMER_ID_SUCCESS,
    payload: {
      customerID: customerID.customerID
    }
  }
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function getCustomerIDFailure(error) {
  return {
    type: GET_CUSTOMER_ID_FAILURE,
    payload: {
      error: error
    }
  }
}

/*
Description: Test function to demonstrate how to charge a card
Arguments: customerID => Unique to the specific customer being charged
currency => Currency of the charge
amount => Amount to charge the user
desc => Description of the charge
Returns: N/A
*/
export function makePayment(id, token, paymentInfo) {
  return async (dispatch) => {
    dispatch(makePaymentStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/chargeCustomer`, {
        // Send over JSON object which contains the amount, currency, customer ID, and description to make the charge
        body: JSON.stringify({
          id,
          token,
          payload:
          {
            amount: paymentInfo.amount,
            currency: paymentInfo.currency,
            customer: paymentInfo.customerID,
            description: paymentInfo.description,
          },
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      // Parse the response so you can access the fields in it
      const res = await response.json();
      if (res.outcome.network_status === 'approved_by_network') {
        dispatch(makePaymentSuccess());
        Alert.alert(
          'Payment received',
          'Your donation has been received. A big thank you from OXO!',
        );
        return res;
      }
      dispatch(makePaymentFailure(res));
      return null;
    } catch (error) {
      dispatch(makePaymentFailure(error));
      return null;
    }
  };
}

function makePaymentStarted() {
  return {
    type: MAKE_PAYMENT_STARTED
  }
}

function makePaymentSuccess() {
  return {
    type: MAKE_PAYMENT_SUCCESS
  }
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function makePaymentFailure(error) {
  return {
    type: MAKE_PAYMENT_FAILURE,
    payload: {
      error: error
    }
  }
}

/*
Description: Allows the user to delete a card
Uses Google Cloud function deleteCard
Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
index => index in the list of this specific item
Returns: res => contains the card token but isn't currently used
Also updates indexSelected in the state
*/
export function deleteCard(item, index, id, token, customerID) {
  return async (dispatch) => {
    dispatch(deleteCardStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/deleteCard`, {
        // Send over JSON object which contains the card token and the customer ID to make  update
        body: JSON.stringify({ id, token, payload: { token: item.token, customerID } }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      })
      // Parse the response so you can access the fields in it
      const res = await response.json();
      return dispatch(deleteCardSuccess(id, token, customerID));
    } catch (error) {
      console.log(error)
      dispatch(deleteCardFailure(error));
      return null;
    }
  };
}

function deleteCardStarted() {
  return {
    type: DELETE_CARD_STARTED,
  };
}

function deleteCardSuccess(id, token, customerID) {
  return async (dispatch) => {
    dispatch(getDefaultCardStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/getCards/${id}/${token}/${customerID}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET'
      })
      // Parse the response so you can access the fields in it
      const cards = await response.json();
      dispatch(getDefaultCardSuccess(cards.defaultCard, cards.cards));
      return cards;
    } catch (error) {
      console.log(error)
      dispatch(getDefaultCardFailure(error));
      return null;
    }
  };
}

function getDefaultCardStarted() {
  return {
    type: GET_DEFAULT_CARD_STARTED,
  };
}

//This function should be checked... it should not work.
function getDefaultCardSuccess(defaultCard, allCards) {
  const cardsSparse = [];
  for (let i = 0; i < allCards.length; i += 1) {
    const card = {
      type: allCards[i].brand,
      digits: allCards[i].last4,
      expMonth: allCards[i].exp_month,
      expYear: allCards[i].exp_year,
      token: allCards[i].id
    };
    cardsSparse.push(card)
  }
  return {
    type: GET_DEFAULT_CARD_SUCCESS,
    payload: {
      defaultCard: defaultCard,
      cards: cardsSparse
    }
  }
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function getDefaultCardFailure(error) {
  return {
    type: GET_DEFAULT_CARD_FAILURE,
    payload: {
      error,
    },
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function deleteCardFailure(error) {
  return {
    type: DELETE_CARD_FAILURE,
    payload: {
      error,
    },
  };
}

/*
Description: Allows the user to change the default card used for payments in the Stripe database.
Uses Google Cloud function changeDefaultCard
Arguments: item => card object which contains {last 4 digits, card type, card token, customer ID}
index => index in the list of this specific item
Returns: res => contains the card token but isn't currently used
Also updates indexSelected in the state
*/
export function changeDefaultCard(item, index, id, token, customerID) {
  return async (dispatch) => {
    dispatch(changeDefaultCardStarted());
    console.log(customerID)
    try {
      console.log('Dispatching change default card');
      const response = await fetch(`${serverInfo.name}/payments/stripe/changeDefaultCard`, {
        // Send over JSON object which contains the card token and the customer ID to make  update
        body: JSON.stringify({ id, token, payload: { token: item.token, customerID } }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      // Parse the response so you can access the fields in it
      const res = await response.json();
      dispatch(changeDefaultCardSuccess(res.default_source));
      return res;
    } catch (error) {
      console.log(error);
      dispatch(changeDefaultCardFailure(error));
      return null;
    }
  };
}

function changeDefaultCardStarted() {
  return {
    type: CHANGE_DEFAULT_CARD_STARTED,
  };
}

function changeDefaultCardSuccess(defaultSource) {
  return {
    type: CHANGE_DEFAULT_CARD_SUCCESS,
    payload: {
      defaultCard: defaultSource,
    },
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function changeDefaultCardFailure(error) {
  return {
    type: CHANGE_DEFAULT_CARD_FAILURE,
    payload: {
      error,
    },
  };
}

/*
Description: Updates the user in the Stripe database and the state
Arguments: token => Unique card token from Stripe
customerID => Unique customer token from Stripe
Returns: res => a JSON object containing information about the customer who was updated
*/
export function addCardToUser(id, token, cardToken, customerID) {
  return async (dispatch) => {
    dispatch(addCardToUserStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/addCardToUser`, {
        body: JSON.stringify({ id, token, payload: { customerID, token: cardToken } }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const res = await response.json();
      dispatch(addCardToUserSuccess(id, token, customerID));
      return res;
    } catch (error) {
      console.log(error);
      dispatch(addCardToUserFailure(error));
      return null;
    }
  };
}

function addCardToUserStarted() {
  return {
    type: ADD_CARD_TO_USER_STARTED,
  };
}

function addCardToUserSuccess(id, token, customerID) {
  return async (dispatch) => {
    dispatch(getDefaultCardStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/getCards/${id}/${token}/${customerID}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET'
      })
      // Parse the response so you can access the fields in it
      const cards = await response.json();
      dispatch(getDefaultCardSuccess(cards.defaultCard, cards.cards));
      return cards;
    } catch (error) {
      console.log(error);
      dispatch(getDefaultCardFailure(error));
      return null;
    }
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function addCardToUserFailure(error) {
  return {
    type: ADD_CARD_TO_USER_FAILURE,
    payload: {
      error,
    },
  };
}

/*
Description: Creates a new Customer in Stripe with a card linked to it
Arguments: token => card token for the card which will be linked to this new customer
Returns: res => a JSON object containing information pertaining to the customer which was just created
*/
export function createCustomer(id, token, createCustomerInformation) {
  return async (dispatch) => {
    dispatch(createCustomerStarted());
    try {
      const response = await fetch(`${serverInfo.name}/payments/stripe/createCustomer`, {
        body: JSON.stringify({
          id,
          token,
          payload: {
            token: createCustomerInformation.token,
            name: createCustomerInformation.name,
          },
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const res = await response.json();
      dispatch(createCustomerSuccess(res.id));
      return res
    } catch (error) {
      console.log(error)
      dispatch(createCustomerFailure(error));
      return error;
    }
  }
}

function createCustomerStarted() {
  return {
    type: CREATE_CUSTOMER_STARTED,
  };
}

function createCustomerSuccess(customerID) {
  return {
    type: CREATE_CUSTOMER_SUCCESS,
    payload: {
      customerID,
    },
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function createCustomerFailure(error) {
  return {
    type: CREATE_CUSTOMER_FAILURE,
    payload: {
      error,
    },
  };
}

/*
Description: Send card information to Stripe and get back a card token
Arguments: information => contains card number, expiration month/year, cvc, and user name
Returns: card token for this information
*/
export function sendToken(information) {
  return async (dispatch) => {
    dispatch(sendTokenStarted());
    try {
      const card = await stripePK.createToken(information);
      dispatch(sendTokenSuccess(card.id));
      return card;
    } catch (error) {
      console.log(error);
      dispatch(sendTokenFailure(error));
      return null;
    }
  };
}

function sendTokenStarted() {
  return {
    type: SEND_TOKEN_STARTED,
  };
}

function sendTokenSuccess() {
  return {
    type: SEND_TOKEN_SUCCESS,
  };
}

/* In future, expand this to dispatch an action notifying developers of error. Send user
information and error details. */
function sendTokenFailure(error) {
  return {
    type: SEND_TOKEN_FAILURE,
    payload: {
      error,
    },
  };
}
