import { setupPlayers } from './player.js'
import { screens }  from './screens.js'
import { GameScreen }  from './gamescreen.js'

// Create new instance of GameScreen. This will add necessary screens to the "game-container" element in the DOM
const rapBattleGame = new GameScreen();

// Add predefined screens to the game
for (screen in screens){
	rapBattleGame.addScreenToList(screen, screens[screen]);
}

// start the game
rapBattleGame.startGame();