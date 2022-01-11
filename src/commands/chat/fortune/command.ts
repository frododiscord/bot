import {Command} from '../../../core/Command';
import fortune from './fortune.js';

export const command: Command = {
	name: 'fortune',
	description: 'Sends a random fortune',
	version: '1.0.0',
	handler: fortune,
};
