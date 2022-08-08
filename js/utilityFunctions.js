export const utility = {
	camelCaseCheck: (s, caller) => {
		// check if string is camel case 
		const isCamelCase = /^[a-z]+([A-Z][a-z]+)+/g;
		if(!s.match(isCamelCase)){
			// throw error if string is not camel case
			let error_message = 'String '+s+' from func '+caller+' must be defined as a camel case string, beginning with a lowercase letter';
			throw new Error(error_message);
		}
	},
	convertToHyphenId: (pageName) => {
		// converts camelCase page name to hyphenated id name 
		const ID = pageName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		return ID;
	}
};