import {Command} from '../../../core/Command';
import joke from './joke.js';

export const command: Command = {
	name: 'joke',
	description: 'Sends a random joke',
	version: '1.0.0',
	handler: joke,
};
