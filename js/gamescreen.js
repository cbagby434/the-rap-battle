class GameScreen{
	// Manages display and behavior of screens in the game
	constructor(options){
		this.options = {
			currentScreen: null,	// Current screen visible to user
			currentScreenIndex: 0,	// Current index of visible screen
			screens: { 	// contains all screen info for the game
				screenOrder: []	// maintains sequence of screens in the game 
			},
			defaultContainerClass: 'container-fluid game-page', // handles classname for screen addition to maintain css styling 
			currentDecisionType: null // decision type that determines how it will show users the following screen (form or click)
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
			// adds screen information to an object (this.options.screens) to use later for creating the screen
			this.options.screens[screenName] = optionsObj;
			
			// adds screen to array, allowing game to show screens in sequence
			this.options.screens.screenOrder.push(screenName);
		}
		this.startGame = () => {
			// begins showing user game screens, beginning with the first in the screenOrder array
			const firstScreenName = this.options.screens.screenOrder[0];
			this.createGameScreen(firstScreenName);
		}
		this.createGameScreen = (screenName) => {
			// uses screen info to create screen element and add to "game-container" div in the DOM
			
			// create element
			let el = document.createElement('div');
			
			// runs function to add dynamic information to gamescreen, if available
			el.innerHTML = this.options.screens[screenName].finishElement ? this.options.screens[screenName].finishElement(this.options.screens[screenName].screenInfo.innerHTML) : this.options.screens[screenName].screenInfo.innerHTML;

			el.id = this.convertToHyphenId(screenName);
			this.options.currentScreen = el.id; // set current screen for ref
			el.className = this.options.defaultContainerClass;


			const gameScreen = document.getElementById("game-container");
			document.body.insertBefore(el, gameScreen);
			
			// determine user decision type
			this.options.currentDecisionType = el.getElementsByTagName('form').length == 0 ? 'click' : 'submit';
			const decisionButton = document.getElementById(el.id).getElementsByClassName('decision-button')[0];
			this.handleDecision(el, decisionButton, this.options.screens[screenName].screenInfo.customEvent);

			// Fire this event after rendering page
			const afterRenderEvt = this.options.screens[screenName].screenInfo.fireAfterRender
			const thisEvent = new CustomEvent(afterRenderEvt, {});
			document.dispatchEvent(thisEvent);
		}
		this.handleDecision = (target, clickElement, customEvent) => {
			// handles decision made by user that will save information about the screen for the future and show user the following screen
			
			if(this.options.currentDecisionType == 'submit'){
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
			if (this.options.currentDecisionType == 'click') {
				// if screen has click event decision
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
			document.getElementById(this.options.currentScreen).style.display = 'none';
		}
		this.nextScreen = () => {
			// display next screen
			this.removeGameScreen();
			this.options.currentScreenIndex+=1; // set current sceen index
			const nextScreenName = this.options.screens.screenOrder[this.options.currentScreenIndex];
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
	}
}

export { GameScreen };
