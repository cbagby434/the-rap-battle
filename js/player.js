import { rapperDict, rapperChoices } from './rappers.js';
import { Rapper } from './rapperFactory.js';	

console.log(rapperDict);
console.log(rapperChoices);

let playerOne, playerTwo;

const setupPlayers = () => {
	let playerOneName = document.getElementById('playerOneName').value;
	let playerTwoName = document.getElementById('playerTwoName').value;
	playerOne = new Player(playerOneName, '1');
	playerTwo = new Player(playerTwoName, '2');
	playerOne.assignRappers();
	playerOne.getPlayerDetails();
	console.log(playerOne.rapperElements[playerOne.rappers[0]].songs())
	playerTwo.assignRappers();
	playerTwo.getPlayerDetails();
}

document.addEventListener('setupPlayers', () => {
	console.log('setupPlayers heard');
	setupPlayers();
});

class Player {
	constructor(name, order){
		this.name = name;
		this.playerOrder = order;
		this.rappers = [];
		this.rapperElements = {}
		this.assignRappers = () => {
			while(this.rappers.length < 3){
				let targetIndex = Math.floor(Math.random() * rapperChoices.length)
				let rapperToAdd = rapperChoices[targetIndex];
				this.rappers.push(rapperToAdd);
				const rapperEl = new Rapper();
				this.rapperElements[rapperToAdd] = rapperEl.create({}, rapperDict[rapperToAdd].type);
				rapperChoices.splice(targetIndex, 1);
			}
		}
		this.getPlayerDetails = () => {
			console.log('player', this.playerOrder, 'is', this.name);
			console.log('their rappers are:', this.rapperElements);
		};
	}
}

export { setupPlayers, Player }