import React from "react";
import _ from "lodash";

type characteristic = {
  title: string;
  value: string;
};

type ExpandableRowProps = {
  characteristics: characteristic[]; //Expects an array of characteristics
};

type ExpandableRowState = {};

class ExpandableRow extends React.Component<
  ExpandableRowProps,
  ExpandableRowState
> {
  render() {
    return (
      <div className="expand">
        <div className="info">{this.getContent()}</div>
      </div>
    );
  }
  getContent(): React.ReactNode {
    return _.map(this.props.characteristics, (char: characteristic) => {
      return (
        <div>
          {" "}
          {char.title} {char.value}{" "}
        </div>
      );
    });
  }
}

export default ExpandableRow;
