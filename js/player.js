import { rapperDict, rapperChoices } from './rappers.js';
import { Rapper } from './rapperFactory.js';	

console.log(rapperDict);
console.log(rapperChoices);

document.addEventListener('prepareBattle', ()=>{
	playerOne.settings.currentRapper.name = document.getElementById('playerOne').getElementsByClassName('selected-card')[0].getAttribute('data-rapper-name');
	playerOne.settings.currentRapper.card = playerOne.settings.rapperElements[playerOne.settings.currentRapper.name].makeCard(playerOne.settings.currentRapper.name)
	playerOne.settings.currentRapper.cardEl = document.querySelectorAll('[data-rapper-name="'+playerOne.settings.currentRapper.name+'"]')[0];
	playerTwo.settings.currentRapper.name = document.getElementById('playerTwo').getElementsByClassName('selected-card')[0].getAttribute('data-rapper-name');
	playerTwo.settings.currentRapper.card = playerTwo.settings.rapperElements[playerTwo.settings.currentRapper.name].makeCard(playerTwo.settings.currentRapper.name)
	playerTwo.settings.currentRapper.cardEl = document.querySelectorAll('[data-rapper-name="'+playerTwo.settings.currentRapper.name+'"]')[0];
});



class Player {
	constructor(name, order){
		this.settings = {
			name:name, // player name
			playerOrder: order, // order of play 
			rappers: [], // rappers assigned to player
			rapperElements: {}, // rapper information for battle
			currentRapper: {
				name:null,
				card:null,
				cardEl: null
			} // current rapper selected by user to battle
		}
		this.assignRappers = () => {
			// assigns rappers, at random, to players for battle
			while(this.settings.rappers.length < 3){
				let targetIndex = Math.floor(Math.random() * rapperChoices.length)
				let rapperToAdd = rapperChoices[targetIndex];
				this.settings.rappers.push(rapperToAdd);
				const rapperEl = new Rapper();
				this.settings.rapperElements[rapperToAdd] = rapperEl.create(rapperDict[rapperToAdd]);
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
			console.log('their rappers are:', this.settings.rapperElements);
		};
	}
}

export { Player }