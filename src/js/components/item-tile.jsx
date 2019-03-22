import React from 'react';

export const ItemTile = (props) => {
  const { item } = props;
  const itemImgUrl = item.getImageUrl();
  const itemName = item.getName();

  return (
    <div className="item_tile">
      <img src={itemImgUrl} />
      <p>{itemName}</p>
    </div>
  );
};
