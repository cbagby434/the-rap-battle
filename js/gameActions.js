import { Player } from './player.js';

class GameActions{
	// Manages display and behavior of screens in the game
	constructor(options){
		this.settings = {
			currentScreen: null,	// Current screen visible to user
			currentScreenIndex: 0,	// Current index of visible screen
			screens: { 	// contains all screen info for the game
				screenOrder: []	// maintains sequence of screens in the game 
			},
			defaultContainerClass: 'container-fluid game-page', // handles classname for screen addition to maintain css styling 
			currentDecisionType: null, // decision type that determines how it will show users the following screen (form or click)
			players:[],
			currentPlayer:null,
			opponent:null,
			playerActions: {
				playerOne:['prompt', 'rap', 'damage', 'check'],
				playerTwo:['rap', 'damage', 'check']
			},
			actionCount:-1,
			damageQueue:[]
		};
		// this.addScreenToList = (screenInnerHTML, screenName, customEvent) => {
		this.addScreenToList = (screenName, optionsObj) => {
			// check if screen name is camelCase
			try {
				this.camelCaseCheck(screenName, 'addScreenToList')
			} catch (e){
				// throw error if screen name isn't camel case
				console.error(e); 
				return;
			}
			// adds screen information to an object (this.settings.screens) to use later for creating the screen
			this.settings.screens[screenName] = optionsObj;
			
			// adds screen to array, allowing game to show screens in sequence
			this.settings.screens.screenOrder.push(screenName);
		}
		this.startGame = () => {
			// begins showing user game screens, beginning with the first in the screenOrder array
			const firstScreenName = this.settings.screens.screenOrder[0];
			this.createGameScreen(firstScreenName);
		}
		this.createGameScreen = (screenName) => {
			// uses screen info to create screen element and add to "game-container" div in the DOM
			
			// create element
			let el = document.createElement('div');
			
			// runs function to add dynamic information to gamescreen, if available
			el.innerHTML = this.settings.screens[screenName].finishElement ? this.settings.screens[screenName].finishElement(this.settings.screens[screenName].screenInfo.innerHTML) : this.settings.screens[screenName].screenInfo.innerHTML;

			el.id = this.convertToHyphenId(screenName);
			this.settings.currentScreen = el.id; // set current screen for ref
			el.className = this.settings.defaultContainerClass;


			const gameScreen = document.getElementById("game-container");
			gameScreen.appendChild(el)
			
			// determine user decision type
			this.settings.currentDecisionType = el.getElementsByTagName('form').length == 0 ? 'click' : 'submit';
			const decisionButton = document.getElementById(el.id).getElementsByClassName('decision-button')[0];
			if (decisionButton) {
				this.handleDecision(el, decisionButton, this.settings.screens[screenName].screenInfo.customEvent);
			}

			this.afterRender(screenName);			

		}
		this.afterRender = (screenName) => {
			// Fire this event after rendering page
			const afterRenderEvt = this.settings.screens[screenName].screenInfo.fireAfterRender
			const thisEvent = new CustomEvent(afterRenderEvt, {});
			document.dispatchEvent(thisEvent);
		}
		this.handleDecision = (target, clickElement, customEvent) => {
			// handles decision made by user that will save information about the screen for the future and show user the following screen
			
			if(this.settings.currentDecisionType == 'submit'){
				// if screen requires form submission, listen for submit
				target.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
					e.preventDefault();

					// trigger custom event, defined in main.js, to save information for the future
					const thisEvent = new CustomEvent(customEvent, {});
					document.dispatchEvent(thisEvent);

					// show the following screen
					this.nextScreen();
				});
			}
			if (this.settings.currentDecisionType == 'click') {
				// if screen has click event decision
				console.log(this.settings);
				clickElement.addEventListener('click', (e) => {
					// trigger custom event, defined in main.js, to save information for the future
					if(customEvent){
						const thisEvent = new CustomEvent(customEvent, {});
						document.dispatchEvent(thisEvent);
					}

					// store info and setup next screen
					this.nextScreen();
				});
			}
		}
		this.removeGameScreen = () => {
			// hides current screen
			let oldScreen = document.getElementById(this.settings.currentScreen);
			oldScreen.remove();
		}
		this.nextScreen = () => {
			// display next screen
			this.removeGameScreen();
			this.settings.currentScreenIndex+=1; // set current sceen index
			const nextScreenName = this.settings.screens.screenOrder[this.settings.currentScreenIndex];
			this.createGameScreen(nextScreenName);
		}
		this.camelCaseCheck = (s, caller) => {
			// check if string is camel case 
			const isCamelCase = /^[a-z]+([A-Z][a-z]+)+/g;
			if(!s.match(isCamelCase)){
				// throw error if string is not camel case
				let error_message = 'String '+s+' from func '+caller+' must be defined as a camel case string, beginning with a lowercase letter';
				throw new Error(error_message);
			}
		}	
		this.convertToHyphenId = (pageName) => {
			// converts camelCase page name to hyphenated id name 
			const ID = pageName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			return ID;
		}
		this.startBattle = () => {
			// pick who goes first
			// this.settings.currentPlayer = this.settings.players[Math.floor(Math.random()*2)];
			this.settings.currentPlayer = this.settings.players[0];
			this.settings.opponent = this.settings.players[1];
			let msg = this.settings.currentPlayer.settings.name+' will go first';
			this.sendMessage(this.settings.currentPlayer, msg);
			this.allowProceed();
		}
		this.allowProceed = () => {
			let continueBtn = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('continue-button')[0];
			setTimeout(() => {
				continueBtn.style.display = "inline-block";
			}, 2000);
		}
		this.changePlayer = () => {
			this.settings.currentPlayer = (this.settings.currentPlayer+1)%2
		}
		this.handleTurn = (action) => {
			console.log('handle turn called')
			let currPlayer = this.settings.currentPlayer;
			switch(action){
				case 'prompt':
					this.sendMessage(currPlayer, 'Rap! Pick a song');
					let songs = this.settings.currentPlayer.settings.currentRapper.cardEl.getElementsByClassName('rapper-song');
					let currPlayerEl = document.getElementById(this.settings.currentPlayer.getPlayerElId());
					console.log(songs);
					Array.from(songs).forEach((item, index) => {
						currPlayerEl.getElementsByClassName('rapper-song')[index].addEventListener('click', (e) => {
							if (document.getElementById('playerOne').getElementsByClassName('selected-card').length > 0) {
								document.getElementById('playerOne').getElementsByClassName('selected-card')[0].classList.remove('selected-card');
							}
							e.target.classList.add('selected-card');
						});
					})
					break;
				case 'rap':
					let selectedSong = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('selected-card')[0].innerText;
					let formattedSongInfo = {}
					this.settings.currentPlayer.settings.rapperElements[this.settings.currentPlayer.settings.currentRapper.name].songs.forEach(item => {
						formattedSongInfo[item.name] = item.lyrics
					});
					let damageCount = Math.floor(Math.random()*formattedSongInfo[selectedSong].length)
					let lyrics = formattedSongInfo[selectedSong][damageCount];
					let maxDamage = this.settings.currentPlayer.settings.rapperElements[this.settings.currentPlayer.settings.currentRapper.name].maxDamage;
					let damageDivider =  formattedSongInfo[selectedSong].length;
					let damage = (damageCount+1)*(maxDamage/damageDivider);
					this.settings.damageQueue.push(damage);
					this.sendMessage(currPlayer, lyrics);
					/*let currPlayer = this.settings.currentPlayer.getPlayerElId();
					*/
					break;
				case 'damage':
					let opponent = this.settings.opponent;
					console.log(opponent.settings.rapperElements[this.settings.opponent.settings.currentRapper.name].stamina-this.settings.damageQueue[0]);
					break;
				case 'check':
					break;
			}
		}
		this.proceedToNextAction = (e) => {
			console.log('--proceedToNextAction--')
			let currPlayer = this.settings.currentPlayer.getPlayerElId();
			this.settings.actionCount+=1;
			let action = this.settings.playerActions[currPlayer][this.settings.actionCount];
			this.handleTurn(action)
			document.getElementById(currPlayer).getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
				this.proceedToNextAction(e);
			});
		}
		this.clearMessage = (player) => {
			let oldMessage = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('message')[0];
			if(oldMessage){
				oldMessage.remove();
			}
		}
		this.sendMessage = (player, msg) => {
			this.clearMessage(player);
			console.log(player);
			let playerCount = player.settings.playerOrder === '1' ? 'One' : 'Two' ;
			playerCount = 'player'+playerCount
			let currentMsgContainer = document.getElementById(playerCount).getElementsByClassName('message-display')[0];
			console.log(currentMsgContainer);
			msg = '<div class="message">'+msg+'</div>'
			currentMsgContainer.innerHTML = msg+currentMsgContainer.innerHTML;
		}
		this.setupPlayers = () => {
			// create players, based on user input, and assign rappers for battle, at random
			let playerOneName = document.getElementById('playerOneName').value;
			let playerTwoName = 'CPU';
			window.playerOne = null;
			window.playerTwo = null;
			playerOne = new Player(playerOneName, '1');
			playerTwo = new Player(playerTwoName, '2');
			playerOne.assignRappers();
			playerOne.getPlayerDetails();
			playerTwo.assignRappers();
			playerTwo.getPlayerDetails();
			this.settings.players.push(playerOne)
			this.settings.players.push(playerTwo)
		}
	}
}

export { GameActions };
