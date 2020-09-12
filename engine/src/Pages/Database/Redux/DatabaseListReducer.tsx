import {
	LOAD_DATABASE_LIST_SUCCESS,
	LOAD_DATABASE_LIST_FAILURE,
	LOAD_DATABASE_DATA_SUCCESS,
	LOAD_DATABASE_DATA_FAILURE
} from "./actionTypes";

const initialState = {
	databaseList: []
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case LOAD_DATABASE_LIST_SUCCESS:
			console.log("Fetch database list success")
			return {
				...state,
				databaseList: action.payload
			};
		case LOAD_DATABASE_LIST_FAILURE:
			console.log("Fetch database list failure")
			return {
				...state,
				error: action.payload
			};
		case LOAD_DATABASE_DATA_SUCCESS:
			console.log("get Database data success");
			return {
				...state,
				databaseEntries: action.payload
			};
		case LOAD_DATABASE_DATA_FAILURE:
			console.log("get Database data failure");
			return {
				...state,
				error: action.payload
			}
		default:
			return state;
	}
}