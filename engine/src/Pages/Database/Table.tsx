import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { loadDatabase } from "./Redux/actions";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../../App/react-auth0-spa";
import {
	driverColumns,
	ownerColumns,
	connectionColumns,
	vehicleColumns,
	matchColumns,
	waitlistColumns
} from "./dataColumns"

interface TableProps {
	databaseEntries: any[];
	dispatchLoadDatabase: any;
	location: any;
}

function Table(props: TableProps): React.ReactElement {
	const { getTokenSilently } = useAuth0();
	const [token, setToken] = useState();
	const urlIndex = props.location.pathname.lastIndexOf("/") + 1;
	const currentTable = props.location.pathname.slice(urlIndex);

	useEffect(() => {
		const fetchDatabaseList = async () => {
			const newToken = await getTokenSilently();
			setToken(newToken);

			props.dispatchLoadDatabase(newToken, currentTable, 0, 0);
		};
		fetchDatabaseList();
	}, []);

	const dataTableMap: any = {
		connection: {
			name: "Connection",
			columns: connectionColumns
		},
		driver: {
			name: "Driver",
			columns: driverColumns
		},
		match: {
			name: "Match",
			columns: matchColumns
		},
		owner: {
			name: "Owner",
			columns: ownerColumns
		},
		vehicle: {
			name: "Vehicle",
			columns: vehicleColumns
		},
		waitlist: {
			name: "Waitlist",
			columns: waitlistColumns
		}
	}

	const dataTableOptions: MUIDataTableOptions = {
		filterType: "checkbox",
		selectableRows: "single",
		pagination: true,
		print: false,
		expandableRows: true
	};

	const populateTable = () => {
		return (
			<MUIDataTable
				title={dataTableMap[currentTable].name}
				data={props.databaseEntries}
				columns={dataTableMap[currentTable].columns}
				options={dataTableOptions}
			/>
		)
	}

	return (
		<div>
			{populateTable()}
		</div>
	)
}

const mapStateToProps = (state: any) => {
	return {
		databaseEntries: state.database.databaseEntries
	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {
		dispatchLoadDatabase: (token: string, tableName: string, page: number, pageSize: number) => dispatch(loadDatabase(token, tableName, page, pageSize))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Table);