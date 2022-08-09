import { rapperDict, rapperChoices } from './rappers.js';
import { Rapper } from './rapperFactory.js';	

console.log(rapperDict);
console.log(rapperChoices);

document.addEventListener('prepareBattle', ()=>{
	const playerOneSelection = document.getElementById('playerOne').getElementsByClassName('selected-card')[0].getAttribute('data-rapper-name');
	const playerTwoSelection = document.getElementById('playerTwo').getElementsByClassName('selected-card')[0].getAttribute('data-rapper-name');
	playerOne.setCurrentRapper(playerOneSelection); 
	playerTwo.setCurrentRapper(playerTwoSelection); 
});

class Player {
	constructor(name, order){
		this.settings = {
			name:name, // player name
			playerOrder: order, // order of play 
			currentRapper: {} // current rapper selected by user to battle
		}
		this.rappers = {
			team: [] // rappers assigned to player
			// will contain rapper information for battle
		}
		this.assembleTeam = () => {
			// assigns rappers, at random, to players for battle
			while(this.rappers.team.length < 3){
				let targetIndex = Math.floor(Math.random() * rapperChoices.length)
				let rapperToAdd = rapperChoices[targetIndex];
				this.rappers.team.push(rapperToAdd);
				const rapperEl = new Rapper();
				this.rappers[rapperToAdd] = rapperEl.create(rapperToAdd);
				rapperChoices.splice(targetIndex, 1);
			}
		}
		this.getPlayerElId = () => {
			let suffix = this.settings.playerOrder === '1' ? 'One' : 'Two' ;
			return 'player'+suffix; 
		}
		this.getPlayerDetails = () => {
			// shows each player's settings
			console.log('player', this.settings.playerOrder, 'is', this.settings.name);
			console.log('their rappers are:', this.rappers);
		};
		this.setCurrentRapper = (name) => {
			this.settings.currentRapper = this.rappers[name];
		}
	}
}

export { Player }