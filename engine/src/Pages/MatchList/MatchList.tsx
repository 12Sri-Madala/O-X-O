import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import "./MatchList.css";
import {
  loadDriverMatches,
  loadOwnerMatches,
  makeConnection
} from "./Redux/actions";
import { useAuth0 } from "../../App/react-auth0-spa";

import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

type MatchListProps = {
  driverMatches: [{ id: string }];
  ownerMatches: [{ id: string; carID: string }];
  dispatchLoadDriverMatches: any;
  dispatchLoadOwnerMatches: any;
  dispatchMakeConnection: any;
};

let selectedDriverIndex: number;
let selectedOwnerIndex: number;

function MatchList(props: MatchListProps): React.ReactElement {
  const [date, setDate] = useState<Date | null>(new Date());
  const { getTokenSilently } = useAuth0();
  const [token, setToken] = useState();
  const [refreshRequired, setRefreshRequired] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (refreshRequired) {
        const newToken = await getTokenSilently();
        setToken(newToken);
        props.dispatchLoadOwnerMatches(date, newToken);
        props.dispatchLoadDriverMatches(date, newToken);
        setRefreshRequired(false);
      }
    };
    fetchMatches();
  }, [date, refreshRequired]);

  //This won't trigger a reload of data, so to trigger, need another variable?
  const handleConnect = async () => {
    if (selectedOwnerIndex !== undefined && selectedDriverIndex !== undefined) {
      const driverMatch = props.driverMatches[selectedDriverIndex];
      const ownerMatch = props.ownerMatches[selectedOwnerIndex];

      // new
      const newToken = await getTokenSilently();
      props.dispatchMakeConnection(
        driverMatch.id,
        ownerMatch.id,
        date,
        newToken
      );
      setRefreshRequired(true);
    }
  };

  const driverColumns = [
    { name: "status", label: "Status" },
    { name: "pickStart", label: "Pickup Start" },
    { name: "pickEnd", label: "Pickup End" },
    { name: "dropStart", label: "Dropoff Start" },
    { name: "dropEnd", label: "Dropoff End" },
    { name: "driverID", label: "Driver ID" }
  ];

  const ownerColumns = [
    { name: "status", label: "Status" },
    { name: "pickupTime", label: "Pickup Time" },
    { name: "dropoffTime", label: "Dropoff Time" },
    { name: "pickupLocation", label: "Pickup Spot" },
    { name: "dropoffLocation", label: "Dropoff Spot" },
    { name: "ownerID", label: "Owner ID" }
  ];

  const driverTableOptions: MUIDataTableOptions = {
    filterType: "checkbox",
    selectableRows: "single",
    pagination: false,
    print: false,
    expandableRows: true,
    onRowsSelect: currentRowsSelected =>
      (selectedDriverIndex = currentRowsSelected[0].index)
  };
  const ownerTableOptions: MUIDataTableOptions = {
    filterType: "checkbox",
    selectableRows: "single",
    pagination: false,
    print: false,
    expandableRows: true,
    onRowsSelect: currentRowsSelected =>
      (selectedOwnerIndex = currentRowsSelected[0].index)
  };

  return (
    <div className="App">
      <div className="App-datepicker">
        <DatePicker
          selected={date}
          onChange={date => {
            setDate(date);
            setRefreshRequired(true);
          }}
        />
      </div>
      <div className="App-tables">
        <MUIDataTable
          title={"Drivers"}
          data={props.driverMatches}
          columns={driverColumns}
          options={driverTableOptions}
        />
        &nbsp;&nbsp;
        <MUIDataTable
          title={"Owners"}
          data={props.ownerMatches}
          columns={ownerColumns}
          options={ownerTableOptions}
        />
      </div>
      <div className="App-footer">
        <button
          onClick={handleConnect}
          style={{
            backgroundColor: "#ff5252",
            borderColor: "#fafafa",
            paddingLeft: 15,
            paddingRight: 15,
            borderRadius: 10,
            fontSize: "x-large",
            color: "#fafafa"
          }}
        >
          Connect
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    driverMatches: state.matches.driverMatches,
    ownerMatches: state.matches.ownerMatches
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadDriverMatches: (date: Date, token: string) =>
      dispatch(loadDriverMatches(date, token)),
    dispatchLoadOwnerMatches: (date: Date, token: string) =>
      dispatch(loadOwnerMatches(date, token)),
    dispatchMakeConnection: (
      driverMatchID: string,
      ownerMatchID: string,
      date: Date,
      token: string
    ) => dispatch(makeConnection(driverMatchID, ownerMatchID, date, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchList);
