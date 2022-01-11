import {Command} from '../../../core/Command';
import hangman from './hangman.js';

export const command: Command = {
	name: 'hangman',
	description: 'A game of hangman against another player',
	options: [
		{
			name: 'playertwo',
			description: 'The user you would like to chalaenge',
			type: 'USER',
			required: true,
		},
	],
	version: '1.0.0',
	handler: hangman,
};
