import { rapperDict, rapperChoices } from './rappers.js';
import { Rapper } from './rapperFactory.js';	

console.log(rapperDict);
console.log(rapperChoices);

let playerOne, playerTwo; // initiate players

const setupPlayers = () => {
	// create players, based on user input, and assign rappers for battle, at random
	let playerOneName = document.getElementById('playerOneName').value;
	let playerTwoName = document.getElementById('playerTwoName').value;
	playerOne = new Player(playerOneName, '1');
	playerTwo = new Player(playerTwoName, '2');
	playerOne.assignRappers();
	playerOne.getPlayerDetails();
	playerTwo.assignRappers();
	playerTwo.getPlayerDetails();
}

document.addEventListener('setupPlayers', () => {
	// listening to event from user interaction with gamescreen 
	console.log('setupPlayers heard');
	setupPlayers();
});

class Player {
	constructor(name, order){
		this.settings = {
			name:name, // player name
			playerOrder: order, // order of play 
			rappers: [], // rappers assigned to player
			rapperElements: {} // rapper information for battle
		}
		this.assignRappers = () => {
			// assigns rappers, at random, to players for battle
			while(this.settings.rappers.length < 3){
				let targetIndex = Math.floor(Math.random() * rapperChoices.length)
				let rapperToAdd = rapperChoices[targetIndex];
				this.settings.rappers.push(rapperToAdd);
				const rapperEl = new Rapper();
				this.settings.rapperElements[rapperToAdd] = rapperEl.create({}, rapperDict[rapperToAdd].type);
				rapperChoices.splice(targetIndex, 1);
			}
		}
		this.getPlayerDetails = () => {
			// shows each player's settings
			console.log('player', this.settings.playerOrder, 'is', this.settings.name);
			console.log('their rappers are:', this.settings.rapperElements);
		};
	}
}

export { setupPlayers, Player }