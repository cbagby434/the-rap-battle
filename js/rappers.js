import data from './rappers.json' assert { type: "json" };

// convert JSON data for use in game
const rapperDict = {}
data.rapperData.forEach((item) => {
	rapperDict[item.name] = {
		type:item.type,
		moves:item.moves,
		image:item.image  
	};
})

document.addEventListener('allowChoice', ()=>{
	const cpuRapperCards = Array.from(document.getElementById('playerTwo').getElementsByClassName('rapper-card'));
	const randomCpuSelection = Math.floor(Math.random() * cpuRapperCards.length);
	document.getElementById('playerTwo').getElementsByClassName('rapper-card')[randomCpuSelection].classList.add('selected-card');

	const rapperCards = Array.from(document.getElementById('playerOne').getElementsByClassName('rapper-card'));

	rapperCards.forEach((card) =>{
		card.addEventListener('click', (e)=>{
			if (document.getElementById('playerOne').getElementsByClassName('selected-card').length > 0) {
				document.getElementById('playerOne').getElementsByClassName('selected-card')[0].classList.remove('selected-card');
			}
			e.target.classList.add('selected-card');
		});
	})
});

const rapperChoices = data.rapperData.map(({name}) => name);

export { rapperDict, rapperChoices }