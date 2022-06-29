import { rapperDict, rapperChoices } from './rappers.js';

// const rapperChoices = data.rapperData.map(({name}) => name);

class Legacy {
	constructor(options){
		this.stamina = options.stamina || 125;		
		this.color = options.color || '#c4a747';		
	}
}
class Elite {
	constructor(options){
		this.stamina = options.stamina || 110;
		this.color = options.color || '#d8d8d8';
	}
}
class Finesse {
	constructor(options){
		this.stamina = options.stamina || 100;
		this.color = options.color || '#31639c';
	}
}
class Raw {
	constructor(options){
		this.stamina = options.stamina || 100;
		this.color = options.color || '#8d2c8b';
	}
}

class Rapper {
	create = (options, rapperType) => {
		if(!rapperType){
			return 'unable to create rapper for battle'
		}

		let rapper;

		switch(rapperType){
			case 'legacy':
				console.log(rapperType, 'is running')
				rapper = new Legacy(options); 
				break;
			case 'elite':
				console.log(rapperType, 'is running')
				rapper = new Elite(options); 
				break;
			case 'finesse':
				console.log(rapperType, 'is running')
				rapper = new Finesse(options); 
				break;
			case 'raw':
				console.log(rapperType, 'is running')
				rapper = new Raw(options); 
				break;
		}
		rapper.rapperType = rapperType;
		rapper.songs = () => {
			console.log('these are the songs')
		}
		rapper.rap = () => {
			console.log('these are the lyrics')	
		}

		return rapper;
	}
}

export { Rapper };