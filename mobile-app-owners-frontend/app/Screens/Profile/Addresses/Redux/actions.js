import {
  LOAD_ADDRESSES_STARTED,
  LOAD_ADDRESSES_SUCCESS,
  LOAD_ADDRESSES_FAILURE,
  SAVE_ADDRESS_FAILURE,
  SAVE_ADDRESS_SUCCESS,
  SAVE_ADDRESS_STARTED
} from "./types";

import serverInfo from "../../../../Resources/serverInfo";

export function loadAddresses(id, token) {
  return async dispatch => {
    dispatch(loadAddressesStarted());
    try {
      const response = await fetch(
        `${serverInfo.name}/address/${id}/${token}`,
        {
          headers: {
            "Content-Type": "application/json"
          },
          method: "GET"
        }
      );

      const addresses = await response.json();
      if (addresses.success && addresses.addresses != null) {
        dispatch(loadAddressesSuccess(addresses.addresses));
      } else {
        dispatch(loadAddressesFailure(addresses));
      }
    } catch (error) {
      console.log(error);
      dispatch(loadAddressesFailure(error));
    }
    return null;
  };
}

function loadAddressesStarted() {
  return {
    type: LOAD_ADDRESSES_STARTED
  };
}

function loadAddressesSuccess(addresses) {
  return {
    type: LOAD_ADDRESSES_SUCCESS,
    payload: {
      addresses
    }
  };
}

function loadAddressesFailure(error) {
  return {
    type: LOAD_ADDRESSES_FAILURE,
    payload: {
      error
    }
  };
}
export function saveAddress(address) {
  return dispatch => {
    dispatch(saveAddressStarted());
    const payload = JSON.stringify(address);
    try {
      fetch(`${serverInfo.name}/address/saveAddress`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: payload
      })
        .then(response => response.json())
        .then(async responseJson => {
          if (responseJson.success) {
            dispatch(saveAddressSuccess(responseJson.addresses));
          } else {
            dispatch(saveAddressFailure(responseJson));
          }
        });
    } catch (error) {
      console.log(error);
      dispatch(saveAddressFailure(error));
    }
  };
}

function saveAddressStarted() {
  return {
    type: SAVE_ADDRESS_STARTED
  };
}

function saveAddressSuccess(addresses) {
  return {
    type: SAVE_ADDRESS_SUCCESS,
    payload: addresses
  };
}

function saveAddressFailure() {
  return {
    type: SAVE_ADDRESS_FAILURE
  };
}
