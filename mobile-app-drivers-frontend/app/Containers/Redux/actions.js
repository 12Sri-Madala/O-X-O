import {
CLEAR_ERROR_STARTED,
CLEAR_ERROR_SUCCESS,
CLEAR_ERROR_FAILURE,
} from 'types';

export function clearError() {
    return (dispatch) => {
        dispatch(clearErrorSuccess());
    }
}
