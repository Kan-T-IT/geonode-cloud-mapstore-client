import React from "react";
import { connect } from "react-redux";
import { createPlugin } from "@mapstore/framework/utils/PluginsUtils";
import { createSelector } from "reselect";
import ProcessTable from "@js/components/ProcessTable";

const GpStatusComponents = () => {
  return <ProcessTable />;
};

const SavePlugin = connect(
  createSelector([(state) => state?.gnsave?.saving], (saving) => ({
    saving,
  }))
)(GpStatusComponents);

export default createPlugin("GpState", {
  component: SavePlugin,
});
