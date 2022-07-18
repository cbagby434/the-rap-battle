const screens = {
	// Inner HTML for game landing page screen
	landingPage:{
		screenInfo:{
			innerHTML: '<div class="row justify-content-center">'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<h1 class="text-centered">The Rap Battle</h1>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<h3 class="text-centered">Whose bars are the HARDEST?!?</h3>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="d-grid gap-2 col-6 mx-auto">'+
						'<button type="button" class="btn btn-primary btn-lg text-centered decision-button">Start</button>'+
					'</div>'+
				'</div>'+
			'</div>'
		}
	},

	// Inner HTML for player creation page screen
	createPlayerPage:{ 
		screenInfo:{
			innerHTML: '<form id="player-info">'+
				'<div class="row justify-content-center">'+
					'<div class="row justify-content-center">'+
						'<div class="col align-self-center">'+
							'<div class="mb-3">'+
								'<label for="playerOneName" class="form-label">What do they call you?</label>'+
								'<input type="text" class="form-control" id="playerOneName" required placeholder="Player 1">'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row justify-content-center">'+
						'<div class="d-grid gap-2 col-6 mx-auto">'+
							'<button type="submit" class="btn btn-primary btn-lg text-centered decision-button">Next</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</form>',
			customEvent: 'setupPlayers'
		}
	},

	// Inner HTML for battle page screen
	choicePage: {
		screenInfo:{
			innerHTML: '<div class="row justify-content-center">'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<h3 class="text-centered">Choose your Rapper!</h3>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<div id="playerTwo" class="mb-3 pb-3">'+
							'<div class="player-name">playerTwo.settings.name</div>'+
							'<div class="rapper-display">'+
							'playerTwo.settings.rappers'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<div id="playerOne" class="mb-3 pb-3">'+
							'<div class="player-name">playerOne.settings.name</div>'+
							'<div class="rapper-display">'+
							'playerOne.settings.rappers'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="row justify-content-center">'+
					'<div class="d-grid gap-2 col-6 mx-auto">'+
						'<button type="button" class="btn btn-primary btn-lg text-centered decision-button">Battle</button>'+
					'</div>'+
				'</div>'+
			'</div>',
			customEvent: 'prepareBattle',
			fireAfterRender:'allowChoice'
		},
		finishElement: (innerHTML) => {
			// add dynamic elements to inner html

			innerHTML = innerHTML
					// replace name with current players names
					.replace('playerOne.settings.name', playerOne.settings.name)
					.replace('playerTwo.settings.name', playerTwo.settings.name)
			
			// add rappers to rapper display
			let playerOneRapperElementInnerHTML = ''
			playerOne.settings.rappers.forEach((item) => {
				playerOneRapperElementInnerHTML+=playerOne.settings.rapperElements[item].makeCard(item);
			})
			let playerTwoRapperElementInnerHTML = ''
			playerTwo.settings.rappers.forEach((item) => {
				 playerTwoRapperElementInnerHTML+=playerTwo.settings.rapperElements[item].makeCard(item);
			})
			innerHTML = innerHTML
					// replace name with current players names
					.replace('playerOne.settings.rappers', playerOneRapperElementInnerHTML)
					.replace('playerTwo.settings.rappers', playerTwoRapperElementInnerHTML)

			// return new html
			return innerHTML;
		}
	},
	battlePage: {
		screenInfo:{
			innerHTML: '<div class="row justify-content-center">'+
				'<div class="row justify-content-center">'+
					'<div class="col align-self-center">'+
						'<h3 class="text-centered">Battle!</h3>'+
					'</div>'+
				'</div>'+
				'<div id="playerTwo" class="row justify-content-center">'+
					'<div class="player-name">playerTwo.settings.name</div>'+
					'<div class="col align-self-center">'+
						'<div class="mb-3 pb-3">'+
							'<div class="message-display">'+
								'<button type="button" class="btn btn-primary btn-lg text-centered continue-button">Continue</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="col align-self-center">'+
						'<div id="playerTwo" class="mb-3 pb-3">'+
							'<div class="rapper-display">'+
							'playerTwo.settings.currentRapper'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div id="playerOne" class="row justify-content-center">'+
					'<div class="player-name">playerOne.settings.name</div>'+
					'<div class="col align-self-center">'+
						'<div class="mb-3 pb-3">'+
							'<div class="rapper-display">'+
							'playerOne.settings.currentRapper'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="col align-self-center">'+
						'<div class="mb-3 pb-3">'+
							'<div class="message-display">'+
								'<button type="button" class="btn btn-primary btn-lg text-centered continue-button">Continue</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>',
			fireAfterRender:'allowChoice'
		},
		finishElement: (innerHTML) => {
			// add dynamic elements to inner html

			innerHTML = innerHTML
					// replace name with current players names
					.replace('playerOne.settings.name', playerOne.settings.name)
					.replace('playerTwo.settings.name', playerTwo.settings.name)
					.replace('playerOne.settings.currentRapper', playerOne.settings.currentRapper.card)
					.replace('playerTwo.settings.currentRapper', playerTwo.settings.currentRapper.card)

			// return new html
			return innerHTML;
		}
	}
}

export { screens };