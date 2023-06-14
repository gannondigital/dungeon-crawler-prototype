import React, { useEffect } from "react";
import classNames from "classnames";
import { PropTypes } from "prop-types";

export const Wall = ({ placement = "", surfaces = [] }) => {
  const classes = classNames(...surfaces, `wall-${placement}`);
  useEffect(() => {
    const req = "./wall-" + placement + ".scss";
    require.context(
      __dirname + "../../../../css/components/Passage",
      true,
      /\/wall\-.*\.scss/
    )(req);
  }, [placement]);

  return <div className={classes}></div>;
};
Wall.propTypes = {
  placement: PropTypes.string,
  surfaces: PropTypes.arrayOf(PropTypes.string),
};
export default Wall;
