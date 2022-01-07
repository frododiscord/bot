import {CommandBaseOptions} from './../namespaces/CommandBaseOptions.d';
import {MessageActionRow, MessageButton} from 'discord.js';
import {Button} from './../namespaces/Button.d';
import {Interaction, Message, Options} from '../FrodoClient';

export default class CommandBase {
	message: Message;
	options: Options;
	interaction: Interaction;

	constructor(options: CommandBaseOptions) {
		this.message = options.message;
		this.options = options.options;
		this.interaction = options.interaction;
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

	}
}
