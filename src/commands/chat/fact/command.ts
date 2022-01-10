import {Command} from './../../../namespaces/Command.d';
import fact from './fact.js';

export const command: Command = {
	name: 'fact',
	description: 'Sends a random fact',
	version: '1.0.0',
	handler: fact,
};
