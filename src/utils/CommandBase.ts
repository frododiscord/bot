import {RandomPlayers} from './../namespaces/RandomPlayers.d.js';
import {RandomPlayersError} from './../namespaces/RandomPlayersError.js';
import {ButtonValidate} from '../namespaces/ButtonValidate.js';
import {CommandBaseOptions} from './../namespaces/CommandBaseOptions.d';
import {ButtonInteraction, MessageActionRow, MessageButton} from 'discord.js';
import {Button} from './../namespaces/Button.d';
import {Interaction, Message, Options, FrodoClient} from '../FrodoClient';
import {getRandomPlayers} from './getRandomPlayers.js';

export default class CommandBase {
	message: Message;
	options: Options;
	interaction: Interaction;
	client: FrodoClient;
	registerCommand: boolean;

	constructor(options: CommandBaseOptions) {
		this.message = options.message;
		this.options = options.options;
		this.interaction = options.interaction;
		this.client = options.client;
		this.registerCommand = true;
	}

	public makeButtonRow(...buttons: Button[]): MessageActionRow {
		const buttonArray = [];
		buttons.forEach((button) => {
			buttonArray.push(
				new MessageButton()
					.setLabel(button.label || '')
					.setCustomId(`${this.interaction.id}:${button.id}`)
					.setStyle(button.style || 'PRIMARY')
					.setDisabled(button.disabled || false)
					.setEmoji(button.emoji),
			);
		});
		const row = new MessageActionRow()
			.addComponents(...buttonArray);
		return row;
	}

	public finishCommand(): void {
		this.registerCommand = false;
		this.client.buttonManager.deleteCommand(
			this.message.guild.id,
			this.message.channel.id,
			this.interaction.id,
		);
	}

	public getRandomPlayers(randomList: boolean = true): RandomPlayers {
		const playerList = getRandomPlayers(this.interaction, randomList);
		if (typeof playerList !== 'object') {
			if (playerList === RandomPlayersError.PlayerNotFound) {
				this.message.edit('One of the players could not be found');
			} else if (playerList === RandomPlayersError.SamePlayer) {
				this.message.edit('You cannot play against yourself');
			} else if (playerList === RandomPlayersError.BotPlayer) {
				this.message.edit('You cannot play against a bot');
			}
			this.finishCommand();
			return null;
		}
		return playerList;
	}

	public onButtonClick(buttonId: string) {

	}

	public validateButtonClick(buttonId: string, interaction: ButtonInteraction): ButtonValidate {
		if (interaction.user.id === this.interaction.user.id) return ButtonValidate.Run;
		return ButtonValidate.Message;
	}
}
