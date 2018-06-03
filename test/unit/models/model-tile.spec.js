import { default as tape } from 'tape';

// under test
import { Tile } from '../../../src/js/models/model-tile';

const validWalls = {
  'n': {},
  'e': {},
  's': {},
  'w': {}
};
const validCoords = { x: 1, y: 1};

tape('Tile constructor validates props', (t) => {
  const validWalls = {
    'n': {},
    'e': {},
    's': {},
    'w': {}
  };

  const tile = new Tile({ walls: validWalls, coords: validCoords });
  t.ok(tile instanceof Tile, 'constructor returns valid instance');
  t.end();
});

tape('Tile constructor rejects missing walls', (t) => {

  t.throws(() => {
    const tile = new Tile({foo: 'bar', coords: validCoords });
  }, 'throws an excpetion when walls missing');
  
  t.end();
});

tape('Tile constructor rejects missing wall props', (t) => {

  t.throws(() => {
    const invalidWalls = {
      'n': {},
      'e': {},
      's': {}
    };
    const tile = new Tile({ walls: invalidWalls, coords: validCoords });
  }, 'throws an exception when west wall missing');

  t.throws(() => {
    const invalidWalls = {
      'n': {},
      'e': {},
      'w': {}
    };
    const tile = new Tile({ walls: invalidWalls, coords: validCoords });
  }, 'throws an exception when south wall missing');

  t.throws(() => {
    const invalidWalls = {
      'n': {},
      'w': {},
      's': {}
    };
    const tile = new Tile({ walls: invalidWalls, coords: validCoords });
  }, 'throws an exception when east wall missing');

  t.throws(() => {
    const invalidWalls = {
      'e': {},
      'w': {},
      's': {}
    };
    const tile = new Tile({ walls: invalidWalls, coords: validCoords });
  }, 'throws an exception when north wall missing');
  
  t.end();
});

tape('Tile constructor validates coordinates', (t) => {
  t.throws(() => {
    const invalidCoords = {};
    const tile = new Tile({ walls: validWalls, coords: invalidCoords });
  }, 'throws an exeption when coordinates empty');

  t.throws(() => {
    const invalidCoords = {y: 1};
    const tile = new Tile({ walls: validWalls, coords: invalidCoords });
  }, 'throws an exeption when x coordinate missing');

  t.throws(() => {
    const invalidCoords = {x: 1};
    const tile = new Tile({ walls: validWalls, coords: invalidCoords });
  }, 'throws an exeption when y coordinate missing');

  t.throws(() => {
    const invalidCoords = {x: '1', y: 1};
    const tile = new Tile({ walls: validWalls, coords: invalidCoords });
  }, 'throws an exeption when x coordinate invalid');

  t.throws(() => {
    const invalidCoords = {x: 1, y: '1'};
    const tile = new Tile({ walls: validWalls, coords: invalidCoords });
  }, 'throws an exeption when y coordinates invalid');
  
  t.end();
});

tape('Tile getAdjacentTileName returns correct name', (t) => {
  const tile = new Tile({ walls: validWalls, coords: {x:22, y:17} });
  
  const name1 = tile.getAdjacentTileName('n');
  t.equals(name1, '22x16', 'for north direction');

  const name2 = tile.getAdjacentTileName('e');
  t.equals(name2, '23x17', 'for east direction');

  const name3 = tile.getAdjacentTileName('w');
  t.equals(name3, '21x17', 'for west direction');

  const name4 = tile.getAdjacentTileName('s');
  t.equals(name4, '22x18', 'for south direction');

  t.throws(() => {
    tile.getAdjacentTileName('foo');
  }, 'throws an exception when given an invalid direction');

  t.end();
});

