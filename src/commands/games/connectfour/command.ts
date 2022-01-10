import {Command} from './../../../namespaces/Command.d';
import connectFour from './connectfour.js';

export const command: Command = {
	name: 'connectfour',
	description: 'A game of connect four against another player',
	options: [
		{
			name: 'playertwo',
			description: 'The user you would like to chalaenge',
			type: 'USER',
			required: true,
		},
	],
	version: '1.0.0',
	handler: connectFour,
};
