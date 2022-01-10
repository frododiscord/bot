import {Command} from './../../../namespaces/Command.d';
import invite from './invite.js';

export const command: Command = {
	name: 'invite',
	description: 'Get Frodo invite link',
	version: '1.0.0',
	handler: invite,
};
