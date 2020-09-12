import { Alert } from "react-native";

/*
Description: Converts a string-defined date into standard AM/PM string format
Arguments: str - string from matchesDB describing a day in JavaScript Date object friendly notation
Returns: standard AM/PM formatted date string
*/
export function convert(str) {
  const d = new Date(str);
  const amOrPm = d.getHours() < 12 ? " am" : " pm";
  let hour = d.getHours() <= 12 ? d.getHours() : d.getHours() - 12;
  hour = hour === 0 ? 12 : hour;
  const minutes = d.toTimeString().slice(2, 5);
  return hour + minutes + amOrPm;
}

/*
Description: Raises an alert if a time selector is set to a bad value then makes sure all
time selectors are closed (had to close all selectors to fix an android bug)
Arguments: err - string describing what the bad input was
Returns: N/A
*/
function badInput(err, close) {
  Alert.alert(
    "Oops!",
    `Please make sure ${err}`,
    [{ text: "Ok", onPress: close }],
    { cancelable: false }
  );
}

/*
Description: Large switch function to handle all 4 time selectors, prevent any bad values,
and update Dashboard data if values are good
Arguments: date - Date object describing the date and time selected
		   picker - string describing which picker the date came from
Returns: N/A
*/
export async function timeChange(date, picker, data, close, update) {
  console.log(date.toString(), picker);
  const newdate = new Date(date);
  newdate.setHours(newdate.getHours() + 1);
  switch (picker) {
    case "pickStart":
      if (data.pickEnd && date >= new Date(data.pickEnd)) {
        await update(
          { pickStart: date.toString() },
          { pickStartVis: false, psUpdate: true }
        );
        await update(
          { pickEnd: newdate.toString() },
          { pickEndVis: false, peUpdate: true }
        );
      }
      update(
        { pickStart: date.toString() },
        { pickStartVis: false, psUpdate: true }
      );
      break;
    case "pickEnd":
      var pickStartD = new Date(data.pickStart);
      if (data.pickStart) {
        if (
          (date.getMinutes() - pickStartD.getMinutes() < 15 &&
            date.getHours() === pickStartD.getHours()) ||
          date < pickStartD
        ) {
          update({}, {});
          badInput("your pick-up range is at least 15 minutes");
          break;
        }
      }
      update(
        { pickEnd: date.toString() },
        { pickEndVis: false, peUpdate: true }
      );
      break;
    case "dropStart":
      if (data.pickEnd && date <= new Date(data.pickEnd)) {
        update({}, {});
        badInput("your drop-off start is after your pick-up end");
        break;
      } else if (data.dropEnd && date >= new Date(data.dropEnd)) {
        await update(
          { dropEnd: newdate.toString() },
          { dropEndVis: false, deUpdate: true }
        );
        await update(
          { dropStart: date.toString() },
          { dropStartVis: false, dsUpdate: true }
        );
        break;
      } else if (data.pickStart && date <= new Date(data.pickStart)) {
        update({}, {});
        badInput("your drop-off start is after your pick-up start");
        break;
      }
      update(
        { dropStart: date.toString() },
        { dropStartVis: false, dsUpdate: true }
      );
      break;
    case "dropEnd":
      var dropStartD = new Date(data.dropStart);
      if (data.pickStart && date <= new Date(data.pickStart)) {
        update({}, {});
        badInput("your drop-off end is after your pick-up start");
        break;
      } else if (data.pickEnd && date <= new Date(data.pickEnd)) {
        update({}, {});
        badInput("your drop-off end is after your pick-up end");
        break;
      } else if (data.dropStart) {
        if (
          (date.getMinutes() - dropStartD.getMinutes() < 15 &&
            date.getHours() === dropStartD.getHours()) ||
          date < dropStartD
        ) {
          update({}, {});
          badInput("your drop-off range is at least 15 minutes");
          break;
        }
        update(
          { dropEnd: date.toString() },
          { dropEndVis: false, deUpdate: true }
        );
        break;
      }
  }
}

export function locationAlert() {
  Alert.alert(
    "Additional areas unavailable",
    "For now, you can only pick-up and drop-off vehicles in this area. We are expanding coverage soon. If you have any special requests, let us know!"
  );
}

export function initialize(data, date) {
  data.pickStart = newTime(8, date).toString();
  data.pickEnd = newTime(9, date).toString();
  data.dropStart = newTime(17, date).toString();
  data.dropEnd = newTime(18, date).toString();
}

function newTime(hour, date) {
  d = new Date(date);
  d.setHours(hour);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

export function findNewData(state) {
  const obj = {};
  if (state.psUpdate) {
    obj.pickStart = state.data.pickStart;
  }
  if (state.peUpdate) {
    obj.pickEnd = state.data.pickEnd;
  }
  if (state.dsUpdate) {
    obj.dropStart = state.data.dropStart;
  }
  if (state.deUpdate) {
    obj.dropEnd = state.data.dropEnd;
  }
  return obj;
}

export function availabilityData(init, data, available) {
  const obj = {};
  if (init && !available) {
    obj.pickStart = data.pickStart;
    obj.pickEnd = data.pickEnd;
    obj.dropStart = data.dropStart;
    obj.dropEnd = data.dropEnd;
  }
  obj.status = available ? "Unavailable" : "Available";
  return obj;
}
