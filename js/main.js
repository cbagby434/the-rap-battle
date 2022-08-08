import { screens }  from './screens.js'
import { GameManager }  from './GameManager.js'

// Create new instance of GameScreen. This will add necessary screens to the "game-container" element in the DOM
window.rapBattleGame = new GameManager();

// Add predefined screens to the game
for (screen in screens){
	rapBattleGame.screenManager.addScreenToList(screen, screens[screen]);
}

// start the game
rapBattleGame.actions.startGame();

document.addEventListener('startBattle', () => {
	rapBattleGame.actions.startBattle();
	document.getElementById('playerOne').getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
		rapBattleGame.actions.proceedToNextAction(e);
	});
	document.getElementById('playerTwo').getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
		rapBattleGame.actions.proceedToNextAction(e);
	});
});

document.addEventListener('setupPlayers', () => {
	// listening to event from user interaction with gamescreen 
	rapBattleGame.actions.setupPlayers();
});