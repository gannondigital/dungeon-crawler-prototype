import React from "react";

import "../../../css/components/Inventory/item-tile";

export const ItemTile = ({ item }) => {
  const itemImgUrl = item.getImageUrl();
  const itemName = item.getName();

  return (
    <div className="item_tile">
      <img src={itemImgUrl} title={itemName} />
    </div>
  );
};
