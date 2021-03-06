# Dungeon Crawler Prototype

This is a prototype of an HTML/JS game engine inspired by the RPGs of the 80s. Because of the relatively simple demands of the game (e.g. no significant animation, turn-based actions rather than real-time interactivity), there is no need for a canvas-based game engine, or a canvas at all -- the rendering relies on traditional HTML/CSS.

## Why?

I got the idea for an old-school browser RPG from early CSS3 demos. I've been coming back to it off and on, trying/failing to keep it up to date with modern dev practices while fleshing it out. It's just something fun to work on.

## Technology Choices

This prototype uses a simple Flux pattern, extending Facebook's Flux package, with React as a rendering layer. Redux is fine, but it's overkill for some apps, and I feel there's something to be said for the principles of plain Flux (some of which are disregarded by Redux). The level, and the tiles of which it is comprised, are currently defined as bundled JSON; obviously this won't scale very well and a production version would likely use a database such as sqlite.

## Current State and Next Steps

- The engine is populated with a couple of passages and rooms. You can change direction and move through passages; there's a compass that points 'north'
- There's a simple map view
- You can encounter a few monsters, fight them in a non-trivial (but untuned) combat system, and defeat them (you can't die yet, though)
- You can receive items as 'treasure' after defeating a monster, and view your items in an Inventory screen.

Next steps would include:
* refactoring throughout; it's now far enough along that there are patterns established and some of them are crummy
* starting screen, transition to/from gameplay
* test coverage, switch to Jest for tests
* add linting, ugh
* additional assets, such as varied wall textures, doors, etc.
* combat/character support for attack effects (poison, stun, etc.)
* UI effects when attacks/damage occur
* support for player character info screen (stats, etc.)
* character "death" handling
* item use
* magic use
* soundtrack and sound effects

## Play online!
See the prototype in action at http://gannondigital.github.io/dungeon-crawler-prototype/. 

## License

No license is given to use or reproduce this code for any purpose. If you are interested in using this package or some part of it, please contact me. 