

export class MapTile {

  constructor(tileProps) {
    if (!tilePropsAreValid(tileProps)) {
      throw new TypeError('Invalid tileProps passed to MapTile constructor.');
    }

    
  }

}

function tilePropsAreValid(tileProps) {
  //if (!(tileProps.tile instanceof )
}