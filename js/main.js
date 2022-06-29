import { setupPlayers } from './player.js'

document.getElementsByClassName('decision-button')[0].addEventListener('click', (e) => {
	document.getElementById('start-page').style.display = 'none';
});

document.getElementById('player-info').addEventListener('submit', (e) => {
	e.preventDefault();
	setupPlayers();
	document.getElementById('create-player-page').style.display = 'none';
});