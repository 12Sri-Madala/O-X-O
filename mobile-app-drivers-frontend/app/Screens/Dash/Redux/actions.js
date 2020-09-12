import {
  FETCH_DATA_STARTED,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_CONNECTION_STARTED,
  FETCH_CONNECTION_SUCCESS,
  FETCH_CONNECTION_FAILURE,
  CAL_CHANGE,
  SWIPER_CHANGE,
  UPDATE_DATA_STARTED,
  UPDATE_DATA_SUCCESS,
  UPDATE_DATA_FAILURE,
  MESSAGING,
  MESSAGING_FAILURE,
  CHAT_SUCCESS,
  FETCH_WAITLIST_SUCCESS,
  FETCH_WAITLIST_FAILURE,
  UPDATE_CONN_AND_MATCH_STARTED,
  UPDATE_CONN_AND_MATCH_SUCCESS,
  UPDATE_CONN_AND_MATCH_FAILURE
} from "./types";

import serverInfo from "../../../Resources/serverInfo";

import {
  sbConnect,
  sbCreateGroupChannel,
  sbCreateGroupChannelListQuery,
  sbGetGroupChannelList
} from "../../Chat/sendbirdActions";

import { cancelTodayConnectionSuccess } from "../../Live/Redux/actions";

export function fetchWaitlist(id, token) {
  return dispatch => {
    try {
      fetch(`${serverInfo.name}/waitlist/${id}/${token}`)
        .then(response => response.json())
        .then(responseJson => {
          if (!responseJson.success) {
            dispatch(fetchWaitlistFailure());
          }
          if (responseJson.waitlistEntry) {
            const waitlist = {
              ...responseJson.waitlistEntry,
              percentile: responseJson.percentile,
              userActions: responseJson.userActions
            };
            dispatch(fetchWaitlistSuccess(waitlist));
          }
        });
    } catch (error) {
      dispatch(fetchWaitlistFailure(error));
    }
  };
}

function fetchWaitlistSuccess(payload) {
  return {
    type: FETCH_WAITLIST_SUCCESS,
    payload
  };
}

function fetchWaitlistFailure(err) {
  return {
    type: FETCH_WAITLIST_FAILURE,
    payload: err
  };
}

export function fetchData(id, token) {
  return dispatch => {
    dispatch(fetchDataStarted());
    try {
      fetch(`${serverInfo.name}/dash/${id}/${token}`)
        .then(response => response.json())
        .then(responseJson => {
          if (!responseJson.success) {
            console.log("Error:", responseJson.error);
            dispatch(fetchDataFailure(responseJson.error));
            return;
          }
          console.log(responseJson);
          const { driverInfo } = responseJson.data;
          sbConnect(
            driverInfo.id,
            `${driverInfo.firstName} ${driverInfo.lastName}`
          ).then(() => {
            const groupChannelListQuery = sbCreateGroupChannelListQuery();
            let unread = false;
            if (groupChannelListQuery.hasNext) {
              sbGetGroupChannelList(groupChannelListQuery)
                .then(channels =>
                  channels.forEach(channel => {
                    if (
                      channel.memberCount > 1 &&
                      channel.unreadMessageCount > 0
                    ) {
                      unread = true;
                    }
                  })
                )
                .then(() => {
                  dispatch(fetchDataSuccess(responseJson, unread));
                });
            }
          });
        })
        .catch(error => dispatch(fetchDataFailure(error)));
    } catch (error) {
      console.log(error);
      dispatch(fetchDataFailure(error));
    }
  };
}

function fetchDataStarted() {
  return {
    type: FETCH_DATA_STARTED
  };
}

function fetchDataSuccess(payload, unread) {
  return {
    type: FETCH_DATA_SUCCESS,
    payload,
    unread
  };
}

function fetchDataFailure(err) {
  return {
    type: FETCH_DATA_FAILURE,
    payload: err
  };
}

export function calChange(index) {
  return {
    type: CAL_CHANGE,
    payload: index
  };
}

export function swiperChange(index) {
  return {
    type: SWIPER_CHANGE,
    payload: index
  };
}

export function updateData(data, matchId, index, userId, token) {
  return dispatch => {
    dispatch(updateDataStarted());
    try {
      fetch(`${serverInfo.name}/dash/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          payload: data,
          matchId,
          token,
          userId
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.success) {
            dispatch(updateDataSuccess(responseJson, index));
          } else {
            dispatch(updateDataFailure(responseJson));
          }
        })
        .catch(error => dispatch(updateDataFailure({ error })));
    } catch (error) {
      dispatch(updateDataFailure({ error }));
    }
  };
}

function updateDataStarted() {
  return {
    type: UPDATE_DATA_STARTED
  };
}

function updateDataSuccess(obj, index) {
  return {
    type: UPDATE_DATA_SUCCESS,
    payload: obj.payload,
    index
  };
}

function updateDataFailure(obj) {
  console.log(obj.error);
  return {
    type: UPDATE_DATA_FAILURE,
    payload: obj.error
  };
}

export function updateConnAndMatchStatus(
  userId,
  token,
  connectionID,
  connectionStatus,
  matchStatus,
  index,
  matchId
) {
  return dispatch => {
    dispatch(updateConnAndMatchStatusStarted());
    try {
      // Only a temporary fix, cancelling future connections is currently broken
      // since only the current connection from today is returned.
      if (index === 0) {
        fetch(`${serverInfo.name}/connection/updateConnectionStatus/`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            connectionStatus,
            connectionID,
            matchStatus,
            id: userId,
            token
          })
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.success) {
              dispatch(
                updateConnAndMatchStatusDashSuccess(responseJson, index)
              );
              dispatch(
                cancelTodayConnectionSuccess(responseJson.payload.connection)
              );
            } else {
              dispatch(updateConnAndMatchStatusFailure(responseJson));
            }
          })
          .catch(error => dispatch(updateConnAndMatchStatusFailure({ error })));
      } else {
        dispatch(
          updateData({ status: matchStatus }, matchId, index, userId, token)
        );
      }
    } catch (error) {
      dispatch(updateConnAndMatchStatusFailure({ error }));
    }
  };
}

function updateConnAndMatchStatusStarted() {
  return {
    type: UPDATE_CONN_AND_MATCH_STARTED
  };
}

export function updateConnAndMatchStatusDashSuccess(obj, index) {
  return {
    type: UPDATE_CONN_AND_MATCH_SUCCESS,
    payload: obj.payload,
    index
  };
}

function updateConnAndMatchStatusFailure(obj) {
  console.log("what is the error: ", obj.error);
  return {
    type: UPDATE_CONN_AND_MATCH_FAILURE,
    payload: obj.error
  };
}

export function chatSuccess() {
  return {
    type: CHAT_SUCCESS
  };
}

export function messageOwner(ownerId) {
  return dispatch => {
    sbCreateGroupChannel([ownerId], true)
      .then(channel => {
        dispatch({
          type: MESSAGING,
          payload: channel
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: MESSAGING_FAILURE,
          payload: error
        });
      });
  };
}

export function fetchConnection(id, token) {
  return dispatch => {
    dispatch(fetchConnectionStarted());
    try {
      fetch(`${serverInfo.name}/connection/getActiveConnection/${id}/${token}`)
        .then(response => response.json())
        .then(responseJson => {
          if (!responseJson.success) {
            console.log("Error:", responseJson.error);
            dispatch(fetchConnectionFailure(responseJson.error));
            return;
          }
          dispatch(fetchConnectionSuccess(responseJson.data));
          // Handle Connection Data
        });
    } catch (error) {
      console.log(error);
      dispatch(fetchConnectionFailure(error));
    }
  };
}

function fetchConnectionStarted() {
  return {
    type: FETCH_CONNECTION_STARTED
  };
}

function fetchConnectionSuccess(payload) {
  return {
    type: FETCH_CONNECTION_SUCCESS,
    payload
  };
}

function fetchConnectionFailure(error) {
  return {
    type: FETCH_CONNECTION_FAILURE,
    payload: error
  };
}
