import React from "react";
import { connect } from "react-redux";
import { createPlugin } from "@mapstore/framework/utils/PluginsUtils";
import { createSelector } from "reselect";
import GeoprocessForm from "@js/components/GeoprocessesForm";

const GeoprocessesFormComponents = () => {
  return <GeoprocessForm />;
};

const SavePlugin = connect(
  createSelector([(state) => state?.gnsave?.saving], (saving) => ({
    saving,
  }))
)(GeoprocessesFormComponents);

export default createPlugin("Form", {
  component: SavePlugin,
});
