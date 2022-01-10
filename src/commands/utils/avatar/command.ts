import {Command} from './../../../namespaces/Command.d';
import avatar from './avatar.js';

export const command: Command = {
	name: 'avatar',
	description: 'Get the avatar of a user',
	options: [
		{
			name: 'user',
			description: 'The user to get the avatar of',
			required: false,
			type: 'USER',
		},
	],
	version: '1.0.0',
	handler: avatar,
};
