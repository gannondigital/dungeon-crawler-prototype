import React, { useEffect } from "react";
import classNames from "classnames";
import { PropTypes } from "prop-types";

export const Wall = ({
  placement = "",
  direction = "",
  surfaces = [],
  exit = false,
  objects = [],
}) => {
  const classes = classNames(...surfaces, `wall-${placement}`);
  useEffect(() => {
    const req = "./wall-" + placement + ".scss";
    require.context(
      __dirname + "../../../css/components",
      true,
      /\/wall\-.*\.scss/
    )(req);
  }, [placement]);

  return <div className={classes}></div>;
};
export default Wall;
