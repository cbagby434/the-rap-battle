import { setupPlayers } from './player.js'
import { GameScreen }  from './gamescreen.js'


const startPage = '<div class="row justify-content-center">'+
		'<div class="row justify-content-center">'+
			'<div class="col align-self-center">'+
				'<h1 class="text-centered">The Rap Battle</h1>'+
			'</div>'+
		'</div>'+
		'<div class="row justify-content-center">'+
			'<div class="col align-self-center">'+
				'<h3 class="text-centered">Whose bars are the HARDEST?!?</h3>'+
			'</div>'+
		'</div>'+
		'<div class="row justify-content-center">'+
			'<div class="d-grid gap-2 col-6 mx-auto">'+
				'<button type="button" class="btn btn-primary btn-lg text-centered decision-button">Start</button>'+
			'</div>'+
		'</div>'+
	'</div>';

// '<div id="create-player-page" class="container-fluid game-page">'+
const createPlayerPage = 
		'<form id="player-info">'+
			'<div class="row justify-content-center">'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<div class="mb-3">'+
							'<label for="playerOneName" class="form-label">Player 1</label>'+
							'<input type="text" class="form-control" id="playerOneName" required placeholder="Player 1">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<div class="mb-3">'+
							'<label for="playerTwoName" class="form-label">Player 2</label>'+
							'<input type="text" class="form-control" id="playerTwoName" required placeholder="Player 2">'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="d-grid gap-2 col-6 mx-auto">'+
						'<button type="submit" class="btn btn-primary btn-lg text-centered decision-button">Next</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</form>'

const rapBattleGame = new GameScreen();
rapBattleGame.addScreenToList(startPage, 'startPage');
rapBattleGame.addScreenToList(createPlayerPage, 'createPlayerPage', 'setupPlayers');
rapBattleGame.startGame();