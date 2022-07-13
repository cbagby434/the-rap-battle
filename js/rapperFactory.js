import { rapperDict, rapperChoices } from './rappers.js';

//determine type of rapper and available attributes in battle
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
	create = (options) => {
		const rapperType = options.type
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
		rapper.songs = options.moves
		rapper.rap = () => {
			console.log('these are the lyrics')	
		}
		rapper.makeCard = (name) => {
			let songs = ''

			rapper.songs.forEach((item)=>{
				songs = songs + '<div class="rapper-song">'+item.name+'</div>';
			})
			console.log(options.image)

			const cardElement = '<div style="background-color:'+rapper.color+';" class="rapper-card">'+
					'<div class="rapper-header">'+
						'<span class="rapper-name">'+name+'</span>'+
						'<span class="rapper-stamina">STA:'+rapper.stamina+'</span>'+
					'</div>'+
					'<div class="rapper-image" style="background-image:url('+options.image+');"></div>'+
					'<div class="rapper-songs">'+songs+'</div>'+
				'</div>';
			return cardElement;
		}
		return rapper;
	}
}

export { Rapper };