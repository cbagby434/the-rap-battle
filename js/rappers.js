import data from './rappers.json' assert { type: "json" };

// convert JSON data for use in game
const rapperDict = {}
data.rapperData.forEach((item) => {
	rapperDict[item.name] = {
		'type':item.type,
		'moves':item.moves  
	};
})

const rapperChoices = data.rapperData.map(({name}) => name);

export { rapperDict, rapperChoices }