import {EMBEDCOLOR} from '../../../core/GlobalConstants.js';
import {MessageEmbed, User} from 'discord.js';
import {CommandBaseOptions} from '../../../core/CommandBaseOptions.js';
import CommandBase from '../../../core/CommandBase.js';

export default class Hangman extends CommandBase {
	playerOne: User;
	playerTwo: User;
	players: User[];

	constructor(options: CommandBaseOptions) {
		super(options);

		const playersList = this.getRandomPlayers(false);
		if (!playersList) return;
		this.players = playersList.randomPlayers;
		this.playerOne = playersList.playerOne;
		this.playerTwo = playersList.playerTwo;

		this.runGame();
	}

	async runGame() {
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setDescription(`Waiting for a word to be chosen by ${this.playerOne}`)
					.setColor(EMBEDCOLOR),
			],
		});
	}
}
