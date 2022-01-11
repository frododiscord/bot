import {Command} from '../../../core/Command';
import akinator from './akinator.js';

export const command: Command = {
	name: 'akinator',
	description: 'Play a game of akinator against the powerful akinator AI',
	version: '1.0.0',
	handler: akinator,
};
