import {Command} from '../../../core/Command';
import anagrams from './anagrams.js';

export const command: Command = {
	name: 'anagrams',
	description: 'A round of countdown as seen on TV',
	version: '1.0.0',
	handler: anagrams,
};
