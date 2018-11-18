import React from 'react';

export const ItemTile = (props) => {
  const { item } = props;
  const itemImgUrl = item.getImageUrl();

  return (
    <div className="item_tile">
      <img src={itemImgUrl} />
    </div>
  );
};
