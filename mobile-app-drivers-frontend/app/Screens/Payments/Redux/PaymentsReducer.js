import {
  SEND_TOKEN_STARTED,
  SEND_TOKEN_SUCCESS,
  SEND_TOKEN_FAILURE,
  CREATE_CUSTOMER_STARTED,
  CREATE_CUSTOMER_SUCCESS,
  CREATE_CUSTOMER_FAILURE,
  ADD_CARD_TO_USER_STARTED,
  ADD_CARD_TO_USER_SUCCESS,
  ADD_CARD_TO_USER_FAILURE,
  CHANGE_DEFAULT_CARD_STARTED,
  CHANGE_DEFAULT_CARD_SUCCESS,
  CHANGE_DEFAULT_CARD_FAILURE,
  DELETE_CARD_STARTED,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_FAILURE,
  GET_DEFAULT_CARD_STARTED,
  GET_DEFAULT_CARD_SUCCESS,
  GET_DEFAULT_CARD_FAILURE,
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

const initialState = {
  customerID: null,
  cards: [],
  defaultCard: null,
  name: null,
  loading: false,
  error: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CLEAR_ERROR_STARTED:
      return {
        ...state
      }
    case CLEAR_ERROR_SUCCESS:
      return {
        ...state,
        error: null
      }
    case CLEAR_ERROR_FAILURE:
      return {
        ...state
      }

    case DELETE_CARD_STARTED:
      return {
        ...state,
        loading: true,
      }
    case DELETE_CARD_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case DELETE_CARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case GET_DEFAULT_CARD_STARTED:
      return {
        ...state,
        loading: false,
      }
    case GET_DEFAULT_CARD_SUCCESS:
      console.log('Getting default card success')
      return {
        ...state,
        cards: action.payload.cards,
        defaultCard: action.payload.defaultCard,
        loading: false,
      };
    case GET_DEFAULT_CARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case CHANGE_DEFAULT_CARD_STARTED:
      return {
        ...state,
        loading: true,
      }
    case CHANGE_DEFAULT_CARD_SUCCESS:
      return {
        ...state,
        defaultCard: action.payload.defaultCard,
        loading: false
      };
    case CHANGE_DEFAULT_CARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case GET_CARDS_STARTED:
      console.log("get cards started");

      const silent = (state.cards != null);
      return {
        ...state,
        loading: !silent,
      }
    case GET_CARDS_SUCCESS:
      console.log("get cards success");
      return {
        ...state,
        cards: action.payload.cards,
        defaultCard: action.payload.defaultCard,
        loading: false,
      };
    case GET_CARDS_FAILURE:
      console.log("get cards failure");
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case GET_CUSTOMER_ID_STARTED:
      return {
        ...state,
      };
    case GET_CUSTOMER_ID_SUCCESS:
      return {
        ...state,
        customerID: action.payload.customerID
      };
    case GET_CUSTOMER_ID_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };

    case CREATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customerID: action.payload.customerID
      };
    case CREATE_CUSTOMER_STARTED:
      return {
        ...state,
      };
    case CREATE_CUSTOMER_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };


    case MAKE_PAYMENT_STARTED:
      return {
        ...state,
        loading: true,
      }
    case MAKE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case MAKE_PAYMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    case SEND_TOKEN_STARTED:
      return {
        ...state,
      };
    case SEND_TOKEN_SUCCESS:
      return {
        ...state,
      };
    case SEND_TOKEN_FAILURE:
      return {
        ...state,
        error: action.payload.error
      };

    case ADD_CARD_TO_USER_STARTED:
      return {
        ...state,
        loading: true,
      };
    case ADD_CARD_TO_USER_SUCCESS:
      return {
        ...state,
        cards: action.payload.cards,
        loading: false,
      };
    case ADD_CARD_TO_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: "You are most likely seeing this error because you tried to add a real credit card.  " +
            "We aren't accepting live payments at the moment.  If you want to test functionality try using\n" +
            "4242 4242 4242 4242 or \n6011 1111 1111 1117 \nas the card number with any expiration date/CVC!",
      };

    default:
      return state;
  }
}
