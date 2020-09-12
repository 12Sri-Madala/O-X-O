import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import "./Database.css"
import { getDatabaseList } from "./Redux/actions";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../../App/react-auth0-spa";

interface DatabaseProps {
	uniqueColumns: any[];
	databaseList: any[];
	databaseEntries: any[];
	dispatchDatabaseList: any;
	dispatchLoadDatabase: any;

}

function Database(props: DatabaseProps): React.ReactElement {
	let history = useHistory();
	const { getTokenSilently } = useAuth0();
	const [token, setToken] = useState();

	useEffect(() => {
		const fetchDatabaseList = async () => {
			const newToken = await getTokenSilently();
			setToken(newToken);
			console.log("what is the new token: ", newToken)
			props.dispatchDatabaseList(newToken)
		};
		fetchDatabaseList();
	}, []);

	const generateList = () => {
		return props.databaseList.map((table: string) => {
			let capitalLetter = table[0].toUpperCase()
			let tableName = capitalLetter + table.slice(1)
			return (
				<h2
					key={table}
					className="tableName"
					onClick={() => { history.push(`/table/${table}`) }}
				>{tableName}</h2>
			)
		})
	}

	return (
		<div
			className="container"
		>
			{generateList()}
		</div>
	)
}

const mapStateToProps = (state: any) => {
	return {
		databaseList: state.database.databaseList
	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatchDatabaseList: (token: string) => dispatch(getDatabaseList(token))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Database);