import { rapperDict, rapperChoices } from './rappers.js';

//determine type of rapper and available attributes in battle
// const rapperChoices = data.rapperData.map(({name}) => name);

class Legacy {
	constructor(options){
		this.stamina = options.stamina || 125;		
		this.color = options.color || '#c4a747';
		this.maxDamage = options.maxDamage || 25;		
	}
}
class Elite {
	constructor(options){
		this.stamina = options.stamina || 110;
		this.color = options.color || '#d8d8d8';
		this.maxDamage = options.maxDamage || 25;
	}
}
class Finesse {
	constructor(options){
		this.stamina = options.stamina || 100;
		this.color = options.color || '#31639c';
		this.maxDamage = options.maxDamage || 20;
	}
}
class Raw {
	constructor(options){
		this.stamina = options.stamina || 100;
		this.color = options.color || '#8d2c8b';
		this.maxDamage = options.maxDamage || 20;
	}
}

class Rapper {
	create = (name) => {
		console.log(name);
		let options = rapperDict[name];
		const rapperType = options.type
		if(!rapperType){
			return 'unable to create rapper for battle'
		}

		let rapper;

		switch(rapperType){
			case 'legacy':
				rapper = new Legacy(options); 
				break;
			case 'elite':
				rapper = new Elite(options); 
				break;
			case 'finesse':
				rapper = new Finesse(options); 
				break;
			case 'raw':
				rapper = new Raw(options); 
				break;
		}
		rapper.name = name;
		rapper.rapperType = rapperType;
		rapper.songs = {};
		options.moves.forEach((song)=>{
			rapper.songs[song['name']] = {
				'lyrics': song['lyrics'],
				'trash':[] // lyrics that have already been used in battle
			}
		});
		rapper.rap = (song) => {
			let pendingRaps = {
				lyrics:'',
				damage:0,
				disableSong: false
			}
			// receive selected song
			const lyrics = rapper.songs[song].lyrics
			// choose lyrics at random
			const randLyricIndex = Math.floor(Math.random()*lyrics.length)
			pendingRaps.lyrics = lyrics[randLyricIndex];
			pendingRaps.damage = (rapper.maxDamage / lyrics.length) * (randLyricIndex + 1);
			// move lyric to song trash array, so that it won't be used again
			let pendingTrash = rapper.songs[song].lyrics.splice(randLyricIndex, 1);
			rapper.songs[song].trash.push(pendingTrash);
			// if after turn, no more lyrics are left for song, disable song for use
			if (rapper.songs[song].lyrics.length === 0) {
				pendingRaps.disableSong = true;
			}
			// return object of rap lyrics and pending damage to opponent stamina
			return pendingRaps;
		}
		rapper.staminaLoss = (damage) => {
			let staminaElement = document.querySelectorAll('[data-rapper-name="'+rapper.name+'"]')[0].getElementsByClassName('rapper-stamina')[0];
			console.log(staminaElement);
			rapper.stamina -= damage;
			if (rapper.stamina < 0) {rapper.stamina = 0}
			staminaElement.innerHTML = 'STA:'+rapper.stamina;
		}

		rapper.makeCard = (name) => {
			let songs = ''

			options.moves.forEach((item)=>{
				songs = songs + '<div class="rapper-song" data-song-name="'+item.name+'">'+item.name+'</div>';
			})

			const cardElement = '<div data-rapper-name="'+name+'" style="background-color:'+rapper.color+';" class="rapper-card">'+
					'<div class="rapper-header">'+
						'<span class="rapper-name">'+name+'</span>'+
						'<span class="rapper-stamina">STA:'+rapper.stamina+'</span>'+
					'</div>'+
					'<div class="rapper-image" style="background-image:url('+options.image+');"></div>'+
					'<div class="rapper-songs">'+songs+'</div>'+
				'</div>';

			rapper.card = cardElement

			return rapper.card;
		}

		return rapper;
	}
}

export { Rapper };