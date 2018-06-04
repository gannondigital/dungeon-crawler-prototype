# Dungeon Crawler Prototype

This is a prototype of an HTML/JS game engine inspired by the RPGs of the 80s. Because of the relatively simple demands of the game (e.g. no significant animation, turn-based actions rather than real-time interactivity), there is no need for a canvas-based game engine, or a canvas at all -- the rendering relies on traditional HTML/CSS.

## Why?

I got the idea for an old-school browser RPG from early CSS3 demos. I've been coming back to it off and on, trying to keep it up to date with modern dev practices while fleshing it out. It's just something fun to work on.

## Technology Choices

This prototype uses a simple Flux pattern, extending Facebook's Flux package, with React as a rendering layer. Redux is fine, but it's overkill for some apps, and I feel there's something to be said for the principles of plain Flux (some of which are disregarded by Redux). The level, and the tiles of which it is comprised, are currently defined as JSON; obviously this won't scale very well and a production version would likely use a database such as sqlite.

## Current State and Next Steps

The 'game' isn't very interesting just yet. You can change direction and move through passages and into a single room that has been built out. 

Next steps would include:
* increased test coverage, streamline test runner (it currently writes built assets to disk when compiling the tests, which is unnecessary)
* additional assets, such as varied wall textures, doors, monsters, etc.
* support for rendering monsters and objects within a tile
* support for a map view
* support for player character info screen (stats, inventory, etc.)
* combat rules!
* soundtrack and sound effects

## Play online!
See the prototype in action at http://gannondigital.github.io/dungeon-crawler-prototype/. Again, not super interesting from a gameplay POV. 

## License

No license is given to use or reproduce this code for any purpose. If you are interested in using this package or some part of it, please contact me. 