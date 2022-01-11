import {Command} from '../../../core/Command';
import insult from './insult.js';

export const command: Command = {
	name: 'insult',
	description: 'Sends a random insult',
	options: [
		{
			name: 'user',
			description: 'The user to insult',
			type: 'USER',
			required: false,
		},
	],
	version: '1.0.0',
	handler: insult,
};
