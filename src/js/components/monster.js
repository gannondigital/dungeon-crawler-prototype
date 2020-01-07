import React from "react";

import { Monster as MonsterModel } from "../models/model-monster";
import "../../css/components/monster.scss";

export const Monster = props => {
  const { monster } = props;
  if (!(monster instanceof MonsterModel)) {
    throw new TypeError("Invalid monster obj passed to Monster component");
  }

  const img_url = monster.getImageUrl();
  return (
    <div className="monster">
      <img src={img_url} />
    </div>
  );
};
