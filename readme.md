# Dungeon Crawler Prototype

This is a prototype of an HTML/JS game engine inspired by the RPGs of the 80s. Because of the simple demands of the game (e.g. turn-based actions rather than real-time interactivity), there is no canvas-based game engine, or a canvas at all -- the rendering relies on traditional HTML/CSS (via React).

## Why?

It's just something fun to work on. I like figuring out designs for systems I haven't created before.

## Technology Choices

#### React/flux/JSON
This prototype uses a simple React/Flux pattern. The game level, and the tiles of which it is comprised, are currently defined as bundled JSON data; obviously a production version would likely use a database/networked api.

#### yes, that flux
One of the behaviors that comes with using the OG `flux` is that an action can't be dispatched as the result of another action being dispatched. Every action runs to completion before another can be triggered. Makes you think about how the app's state/data is shaped, and how it gets changed over time.

### domain-driven design
Domain-driven design, as applied to a simple take on a React/Flux application. DDD is common sense, intutive design choices. Both A. in how the application code is divided and organized (the "business logic"), and B. how common patterns are employed as part of the app's architecture (e.g. anything shared).

# scss, not SC
CSS is currently implemented as Sass, transpiled by webpack. I use Styled Components at work a lot, and it's awesome. But it's refreshing to get back to separate style code, and away from stacks of `styled` wrappers in React.

# factories? providers?
Some of the patterns I'm thinking about, their value is under-realized in modern JS. What do they look like in a modern JS app? What if we designed our own software when we wrote javascript -- what new patterns emerge?

## Current State and Next Steps

- The engine is populated with a handful of passages and rooms. You can change direction and move through the level; there's a compass that points 'north'
- There's a simple map view that shows the level and your location
- You can encounter a few monsters, fight them in a non-trivial (but raw) combat system, and, eventually, defeat them (you can't die yet, though)
- You can receive items as 'treasure' after defeating a monster, and view your items in an Inventory screen.

Next steps would include:
* starting screen, transition to/from gameplay
* improve design of combat subsystem
* standardize usage of provider and factory patterns
* replace some flux stores with constant data
* unit test coverage
* add linting
* additional creative assets, such as varied wall textures, doors, stairs, etc.
* support for combat-related effects (poison, stun, etc.)
* UI effects (e.g. flash, shake) when attacks/damage occur
* support for player character info screen (stats, etc.)
* character "death"/game over (nothing currently happens at zero health)
* item use, in and out of combat
* magic use, in and out of combat
* soundtrack and sound effects, web API

## Play online!
See the prototype in action at http://gannondigital.github.io/dungeon-crawler-prototype/. 

## License

No license is given to use or reproduce this code for any purpose. If you are interested in using this package or some part of it, please contact me. 