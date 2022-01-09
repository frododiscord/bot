import {CommandBaseOptions} from '../../../namespaces/CommandBaseOptions.js';
import CommandBase from '../../../utils/CommandBase.js';

export default class Hangman extends CommandBase {
	constructor(options: CommandBaseOptions) {
		super(options);

		const playersList = this.getRandomPlayers();
		if (!playersList) return;
	}
}
