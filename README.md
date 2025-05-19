# Othello

Simple implementation of Othello using React. Deployed to AWS S3/CloudFront using Terraform. URL to deployed website: [here](http://dx0j8altb3d3v.cloudfront.net).

## Run Locally

In the project directory, you can run:

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Development Process/Design Decisions

- Used `create-react-app` to create a boilerplate application.
- Evaluated some options for hosting React SPA on AWS.
- Wrote Terraform scripts to deploy the simple application to AWS S3/CloudFront.
- As I am not a super experienced React developer/have not used it in some time, completed a quick tutorial and wrote a small implementation of Tic-Tac-Toe in React prior to working on the React code for Othello.
- Setup React Components for Board, Tile, and Token. Setup an initial board state (8x8, 4 tokens in the middle). Splitting up the game into these components provides advantages such as reusability, readability, and testability in code design.
- Implemented Othello logic and got the base game/setup working properly - including functions for placing/flipping tiles, checking if players have valid moves/skipping turns, and determining when the game is over.
- Moved all game logic and game state from `Board.js` to `GameEngine.js`. This allows the board component to be more modular and focus on UI rendering/events, while the engine handles the game logic. Additionally, this improves testability of the code because the functions defined in `GameEngine.js` can be tested without having to worry about UI rendering. Additionally, as one of the requirements of the project was to ensure that the codebase can handle future business requirements for game enhancements, defining game logic within `GameEngine.js` ensures that other Engine classes could be defined in the future depending on what game logic the business requires.
- Refactored the game rules from `GameEngine.js` to `DefaultRules.js`, and passed the rules module to GameEngine as a constructor argument. This decision was made with extensibility in mind, as now it would be straightforward to create a different ruleset if the business wanted to create some sort of variant version of Othello.
- Created configuration file `classic.js` which holds values that define the classic ruleset of Othello. Passing this object to `GameEngine.js` will load the classic version of Othello and render it on the browser. However, keeping extensibility in mind, it is much more straightforward to define a variant of Othello as one of these JSON objects, and is human-readable, meaning even non-developers could quickly define custom configurations.
- Refactored the codebase to genericize the colors/representations of the pieces. In my initial implementation, I hardcoded variables using names like `redScore`, `bluePlayer`, etc. Now these colors/tokens are fully customizable, enhancing customization within the application.
- Created a `Tile.js` class to represent each tile in the grid instead of representing them as an integer in a 2D Array. This provides some options for future extensibility, as the Tile class could be utilized to make the game more interesting, by introducing features like power-ups or blockers.
- Considered refactoring the code to be able to better handle oddly-shaped grids. This could potentially be implemented by storing the board state within the configuration file, and updating the rules/engine/rendering of the game to handle missing tiles. Decided not to move forward with this, as I had almost reached 8 hours of development time working on this application. This could be implemented as a future enhancement, if required by the business.
- Utilized AI to enhance CSS to make the front-end UI look more visually appealing.
- Re-deployed the finalized application to AWS using existing Terraform scripts.


