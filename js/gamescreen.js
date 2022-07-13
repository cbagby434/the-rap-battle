class GameScreen{
	constructor(options){
		this.options = {
			currentScreen: null,
			currentScreenIndex: 0,
			screens: {
				screenOrder: []
			},
			defaultContainerClass: 'container-fluid game-page',
			currentDecisionType: null
		};
		this.handleDecision = (target, clickElement, customEvent) => {
			if(this.options.currentDecisionType == 'submit'){
				target.getElementsByTagName('form')[0].addEventListener('submit', (e) => {
					e.preventDefault();
					console.log(customEvent);
					const thisEvent = new CustomEvent(customEvent, {});
					document.dispatchEvent(thisEvent);
					this.removeGameScreen();
				});
			}
			if (this.options.currentDecisionType == 'click') {
				clickElement.addEventListener('click', (e) => {
					this.nextScreen();
				});
			}
		}
		this.addScreenToList = (screenInnerHTML, screenName, customEvent) => {
			this.options.screens[screenName] = {
				'screenInfo':{
					'innerHTML': screenInnerHTML,
					'customEvent': customEvent
				}
			}
			this.options.screens.screenOrder.push(screenName);
		}
		this.createGameScreen = (screenName) => {
			let el = document.createElement('div');
			el.innerHTML = this.options.screens[screenName].screenInfo.innerHTML;
			el.id = this.convertToHyphenId(screenName);
			el.className = this.options.defaultContainerClass;
			const gameScreen = document.getElementById("game-container");
			this.options.currentScreen = el.id;
			document.body.insertBefore(el, gameScreen);
			this.options.currentDecisionType = el.getElementsByTagName('form').length == 0 ? 'click' : 'submit';
			const decisionButton = document.getElementsByClassName('decision-button')[0];
			this.handleDecision(el, decisionButton, this.options.screens[screenName].screenInfo.customEvent);
		}
		this.removeGameScreen = () => {
			document.getElementById(this.options.currentScreen).style.display = 'none';
		}
		this.nextScreen = () => {
			this.removeGameScreen();
			this.options.currentScreenIndex+=1;
			const nextScreenName = this.options.screens.screenOrder[this.options.currentScreenIndex];
			this.createGameScreen(nextScreenName);
		}
		this.convertToHyphenId = (pageName) => {
			const ID = pageName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			return ID;
		}
		this.startGame = () => {
			const firstScreenName = this.options.screens.screenOrder[0];
			this.createGameScreen(firstScreenName);
		}
	}
}

export { GameScreen };
// createGameScreen('start-page', 'container-fluid game-page', startScreen);