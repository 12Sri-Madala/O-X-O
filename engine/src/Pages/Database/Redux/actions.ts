import {
	LOAD_DATABASE_LIST_SUCCESS,
	LOAD_DATABASE_LIST_FAILURE,
	LOAD_DATABASE_DATA_SUCCESS,
	LOAD_DATABASE_DATA_FAILURE
} from "./actionTypes"

export function getDatabaseList(token: string) {
	return (dispatch: any) => {
		try {
			fetch(`/database`, {
				headers: {
					Authorization: "Bearer " + token
				}
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.success) {
						dispatch(getDatabaseListSuccess(responseJson));
					} else {
						dispatch(getDatabaseListError(responseJson.error));
					}
				})
				.catch(error => console.log("Error getting the list of databases: ", error));
		} catch (error) {
			dispatch(getDatabaseListError(error));
		}
	}
}

function getDatabaseListSuccess(obj: any) {
	return {
		type: LOAD_DATABASE_LIST_SUCCESS,
		payload: obj.dataTables
	}
}

function getDatabaseListError(err: any) {
	return {
		type: LOAD_DATABASE_LIST_FAILURE,
		payload: err
	}
}

export function loadDatabase(token: string, table: string, page: number, pageSize: number) {
	return (dispatch: any) => {
		try {
			fetch(`/database/tableName/${table}/${page}/${pageSize}`, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
				.then(response => response.json())
				.then(responseJson => {
					if (responseJson.success) {
						dispatch(loadDatabaseSuccess(responseJson.data));
					} else {
						dispatch(loadDatabaseError(responseJson.error));
					}
				})
				.catch(error => console.log(`Error getting the data of ${table}: `, error));
		} catch (error) {
			dispatch(loadDatabaseError(error))
		}
	}
}

function loadDatabaseSuccess(obj: any) {
	return {
		type: LOAD_DATABASE_DATA_SUCCESS,
		payload: obj
	}
}

function loadDatabaseError(err: any) {
	return {
		type: LOAD_DATABASE_DATA_FAILURE,
		payload: err
	}
}