import { screens }  from './screens.js'
import { GameActions }  from './gameActions.js'

// Create new instance of GameScreen. This will add necessary screens to the "game-container" element in the DOM
window.rapBattleGame = new GameActions();

// Add predefined screens to the game
for (screen in screens){
	rapBattleGame.addScreenToList(screen, screens[screen]);
}

// start the game
rapBattleGame.startGame();

document.addEventListener('startBattle', () => {
	rapBattleGame.startBattle();
});

document.addEventListener('setupPlayers', () => {
	// listening to event from user interaction with gamescreen 
	rapBattleGame.setupPlayers();
});