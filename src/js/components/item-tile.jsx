import React from "react";

import "../../css/components/item-tile";

export const ItemTile = props => {
  const { item } = props;
  const itemImgUrl = item.getImageUrl();
  const itemName = item.getName();

  return (
    <div className="item_tile">
      <img src={itemImgUrl} title={itemName} />
    </div>
  );
};
