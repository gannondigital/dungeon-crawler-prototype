import React from "react";
import PropTypes from "prop-types";

import MonsterModel from "../../../models/monster";
import "../../../../css/components/Passage/Combat/monster.scss";

export const Monster = ({ monster }) => {
  const imgUrl = monster.getImageUrl();
  const imgFileUrl = require(`../../../../img/monsters/${imgUrl}`);

  return (
    <div className="monster">
      <img src={imgFileUrl} />
    </div>
  );
};
Monster.propTypes = {
  monster: PropTypes.instanceOf(MonsterModel),
};
