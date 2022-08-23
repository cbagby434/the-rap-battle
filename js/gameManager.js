import { Player } from './player.js';
import { utility } from './utilityFunctions.js';

class GameManager{
	// Manages display and behavior of the game
	constructor(options){
		this.settings = {
			defaultContainerClass: 'container-fluid game-page', // handles classname for screen addition to maintain css styling 
			currentDecisionType: null, // decision type that determines how it will show users the following screen (form or click)
			players:[],
			currentPlayer:null,
			opponent:null,
			damageQueue:0
		};
		// this object will handle all game display
		this.screenManager = {
			currentScreen: null,	// Current screen visible to user
			currentScreenIndex: 0,	// Current index of visible screen
			screens: { 	// contains all screen info for the game
				screenOrder: []	// maintains sequence of screens in the game 
			},
			createGameScreen: (screenName) => {
				// uses screen info to create screen element and add to "game-container" div in the DOM
				
				// create element
				let el = document.createElement('div');
				
				// runs function to add dynamic information to gamescreen, if available
				el.innerHTML = this.screenManager.screens[screenName].finishElement ? this.screenManager.screens[screenName].finishElement(this.screenManager.screens[screenName].screenInfo.innerHTML) : this.screenManager.screens[screenName].screenInfo.innerHTML;

				el.id = utility.convertToHyphenId(screenName);
				this.screenManager.currentScreen = el.id; // set current screen for ref
				el.className = this.settings.defaultContainerClass;


				const gameScreen = document.getElementById("game-container");
				gameScreen.appendChild(el)
				
				// determine user decision type
				this.settings.currentDecisionType = el.getElementsByTagName('form').length == 0 ? 'click' : 'submit';
				const decisionButton = document.getElementById(el.id).getElementsByClassName('decision-button')[0];
				if (decisionButton) {
					this.actions.handleDecision(el, decisionButton, this.screenManager.screens[screenName].screenInfo.customEvent);
				}
				console.log(this);
				this.screenManager.afterRender(screenName);			
			},
			// this.addScreenToList = (screenInnerHTML, screenName, customEvent) => {
			addScreenToList: (screenName, optionsObj) => {
				// check if screen name is camelCase
				try {
					utility.camelCaseCheck(screenName, 'addScreenToList')
				} catch (e){
					// throw error if screen name isn't camel case
					console.error(e); 
					return;
				}
				// adds screen information to an object (this.screenManager.screens) to use later for creating the screen
				this.screenManager.screens[screenName] = optionsObj;
				
				// adds screen to array, allowing game to show screens in sequence
				this.screenManager.screens.screenOrder.push(screenName);
			},
			removeGameScreen: () => {
				// hides current screen
				let oldScreen = document.getElementById(this.screenManager.currentScreen);
				oldScreen.remove();
			},
			nextScreen: () => {
				// display next screen
				this.screenManager.removeGameScreen();
				this.screenManager.currentScreenIndex+=1; // set current sceen index
				const nextScreenName = this.screenManager.screens.screenOrder[this.screenManager.currentScreenIndex];
				this.screenManager.createGameScreen(nextScreenName);
			},
			afterRender: (screenName) => {
				// Fire this event after rendering page
				const afterRenderEvt = this.screenManager.screens[screenName].screenInfo.fireAfterRender
				const thisEvent = new CustomEvent(afterRenderEvt, {});
				document.dispatchEvent(thisEvent);
			}
		};
		this.actions = {
			playerActions: {
				playerOne:['prompt', 'rap', 'damage', 'check'],
				playerTwo:['rap', 'damage', 'check']
			},
			canProceed: false,
			actionCount:-1,
			startGame: () => {
				// begins showing user game screens, beginning with the first in the screenOrder array
				const firstScreenName = this.screenManager.screens.screenOrder[0];
				this.screenManager.createGameScreen(firstScreenName);
			},
			handleDecision: (target, clickElement, customEvent) => {
				// handles decision made by user that will save information about the screen for the future and show user the following screen
				
				if(this.settings.currentDecisionType == 'submit'){
					// if screen requires form submission, listen for submit
					target.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
						e.preventDefault();

						// trigger custom event, defined in main.js, to save information for the future
						const thisEvent = new CustomEvent(customEvent, {});
						document.dispatchEvent(thisEvent);

						// show the following screen
						this.screenManager.nextScreen();
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
						this.screenManager.nextScreen();
					});
				}
			},
			setupPlayers: () => {
				// create players, based on user input, and assign rappers for battle, at random
				let playerOneName = document.getElementById('playerOneName').value;
				let playerTwoName = 'CPU';
				window.playerOne = null;
				window.playerTwo = null;
				playerOne = new Player(playerOneName, '1');
				playerTwo = new Player(playerTwoName, '2');
				playerOne.assembleTeam();
				playerOne.getPlayerDetails();
				playerTwo.assembleTeam();
				playerTwo.getPlayerDetails();
				this.settings.players.push(playerOne);
				this.settings.players.push(playerTwo);
				// listen for when to prepare battle assets
				document.addEventListener('prepareBattle', ()=>{
					this.actions.prepareBattle();
				});
			},
			prepareBattle: () => {
				const playerOneSelection = document.getElementById('playerOne').getElementsByClassName('selected-card')[0].getAttribute('data-rapper-name');
				const playerTwoSelection = document.getElementById('playerTwo').getElementsByClassName('selected-card')[0].getAttribute('data-rapper-name');
				playerOne.setCurrentRapper(playerOneSelection); 
				playerTwo.setCurrentRapper(playerTwoSelection);
				
				// listen for when to start battle
				document.addEventListener('startBattle', () => {
					this.actions.startBattle();
					document.getElementById('playerOne').getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
						if (this.actions.canProceed) {
							this.actions.proceedToNextAction(e);
						}
					});
					document.getElementById('playerTwo').getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
						if (this.actions.canProceed) {
							this.actions.proceedToNextAction(e);
						}
					});
				});

			},
			startBattle: () => {
				// pick who goes first
				// this.settings.currentPlayer = this.settings.players[Math.floor(Math.random()*2)];
				this.settings.currentPlayer = this.settings.players[0];
				this.settings.opponent = this.settings.players[1];
				let msg = this.settings.currentPlayer.settings.name+' will go first';
				this.actions.sendMessage(this.settings.currentPlayer, msg);
				this.actions.canProceed = true;
				this.actions.allowProceed();
			},
			proceedToNextAction: (e) => {
				console.log('--proceedToNextAction--')
				let currPlayer = this.settings.currentPlayer.getPlayerElId();
				this.actions.actionCount+=1;
				let action = this.actions.playerActions[currPlayer][this.actions.actionCount];
				this.actions.handleTurn(action)
				document.getElementById(currPlayer).getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
					if (this.actions.canProceed) {
						this.actions.proceedToNextAction(e);
					}
				});
			},
			allowProceed: () => {
				console.log('allowProceed');
				let continueBtn = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('continue-button')[0];
				setTimeout(() => {
					continueBtn.style.display = "inline-block";
				}, 2000);
			},
			changePlayer: () => {
				this.settings.currentPlayer = (this.settings.currentPlayer+1)%2
			},
			endTurn: () => {
				//reset action count
				this.actions.actionCount= -1;
				//clear message screen
				this.actions.clearMessage(this.settings.currentPlayer);
				//turn off current player message screen
				let continueBtn = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('continue-button')[0];
				continueBtn.style.display = 'none';
				//change current player
				let newOpp = this.settings.currentPlayer; 
				let currPlayer = this.settings.opponent; 
				this.settings.currentPlayer = currPlayer;
				this.settings.opponent = newOpp;
				//send message that next player's turn is starting
				let msg = 'Now it\'s '+this.settings.currentPlayer.settings.name+'\'s turn';
				this.actions.sendMessage(this.settings.currentPlayer, msg);
				//allow procession of battle
				this.actions.allowProceed();
				document.getElementById(currPlayer.getPlayerElId()).getElementsByClassName('continue-button')[0].addEventListener('click', (e) => {
					if(this.actions.canProceed){
						this.actions.proceedToNextAction(e);
					}
				});
			},
			handleTurn: (action) => {
				console.log('handle turn called', action)
				let currPlayer = this.settings.currentPlayer;
				const currentCardEl = document.querySelectorAll('[data-rapper-name="'+this.settings.currentPlayer.settings.currentRapper.name+'"]')[0];
				let songs = currentCardEl.getElementsByClassName('rapper-song');
				let currPlayerEl = document.getElementById(this.settings.currentPlayer.getPlayerElId());
				let opponent = this.settings.opponent;
				switch(action){
					case 'prompt':
						this.actions.canProceed = false;
						this.actions.sendMessage(currPlayer, 'Rap! Pick a song');
						Array.from(songs).forEach((item, index) => {
							currPlayerEl.getElementsByClassName('rapper-song')[index].addEventListener('click', (e) => {
								let thisPlayer = this.settings.currentPlayer;
								let thisAction = this.actions.playerActions[thisPlayer.getPlayerElId()][this.actions.actionCount];
								if(thisAction === 'prompt' && thisPlayer.settings.name !== 'CPU'){
									this.actions.canProceed = true;
									if (document.getElementById('playerOne').getElementsByClassName('selected-card').length > 0) {
										document.getElementById('playerOne').getElementsByClassName('selected-card')[0].classList.remove('selected-card');
									}
									e.target.classList.add('selected-card');
								}
							});
						})
						break;
					case 'rap':
						this.actions.canProceed = false;
						if(this.settings.currentPlayer.settings.name === 'CPU') {
							let randomSongIndex = Math.floor(Math.random()*songs.length);
							console.log(randomSongIndex);
							currPlayerEl.getElementsByClassName('rapper-song')[randomSongIndex].classList.add('selected-card');
						}
						let selectedSong = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('selected-card')[0].innerText;
						console.log('rapper about to rap');
						let rapping = this.settings.currentPlayer.settings.currentRapper.rap(selectedSong);
						if (rapping.disableSong) {
							document.getElementById(currPlayer.getPlayerElId()).querySelectorAll('[data-song-name="'+selectedSong+'"]')[0].classList.add('disabled');
						}
						this.settings.damageQueue = rapping.damage;
						this.actions.sendMessage(currPlayer, rapping.lyrics);
						this.actions.canProceed = true;
						break;
					case 'damage':
						this.actions.canProceed = false;
						opponent.settings.currentRapper.staminaLoss(this.settings.damageQueue);
						let msg = 'those bars hurt '+opponent.settings.currentRapper.name+'\'s '+'stamina by '+ this.settings.damageQueue+' points';
						this.actions.sendMessage(currPlayer, msg);
						this.actions.canProceed = true;
						break;
					case 'check':
						this.actions.canProceed = false;
						//clear selection
						currPlayerEl.getElementsByClassName('selected-card')[0].classList.remove('selected-card');
						this.actions.canProceed = true;
						// check if opponent rapper's stamina is at 0
						if(opponent.settings.currentRapper.stamina === 0){
							// if so, trigger battle end and return to selction screen 
							this.actions.endBattle()
						} else{
							// if not go to next turn
							this.actions.endTurn()
						}
						break;
				}
			},
			endBattle: () => {

			},
			clearMessage: (player) => {
				let oldMessage = document.getElementById(this.settings.currentPlayer.getPlayerElId()).getElementsByClassName('message')[0];
				if(oldMessage){
					oldMessage.remove();
				}
			},
			sendMessage: (player, msg) => {
				console.log('sent msg');
				this.actions.clearMessage(player);
				console.log(player);
				let playerCount = player.settings.playerOrder === '1' ? 'One' : 'Two' ;
				playerCount = 'player'+playerCount
				let currentMsgContainer = document.getElementById(playerCount).getElementsByClassName('message-display')[0];
				console.log(currentMsgContainer);
				msg = '<div class="message">'+msg+'</div>'
				currentMsgContainer.innerHTML = msg+currentMsgContainer.innerHTML;
			}
		}
	}
}

export { GameManager };
