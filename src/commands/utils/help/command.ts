import {Command} from './../../../namespaces/Command.d';
import help from './help.js';

export const command: Command = {
	name: 'help',
	description: 'Get help with Frodo',
	version: '1.0.0',
	handler: help,
};
