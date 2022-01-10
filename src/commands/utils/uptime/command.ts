import {Command} from './../../../namespaces/Command.d';
import uptime from './uptime.js';

export const command: Command = {
	name: 'uptime',
	description: 'Get Frodo\'s uptime',
	version: '1.0.0',
	handler: uptime,
};
