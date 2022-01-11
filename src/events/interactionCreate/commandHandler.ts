import {handleError} from '../../core/ErrorHandling/ErrorHandler.js';
import {getMessage} from '../../core/MessageHandler.js';
import {FrodoClient, Interaction} from '../../core/FrodoClient';
import CommandBase from '../../core/CommandBase.js';
import {Event} from '../../core/Event.js';

export const event : Event = {
	name: 'interactionCreate',
	identifier: 'commandHandler',
	handler: commandHandler,
};


async function commandHandler(this: FrodoClient, interaction: Interaction) {
	if (!interaction.isCommand()) return;

	if (!interaction.guild) {
		return interaction.reply({
			content: 'This command is not available in DMs, please try again in a server',
			ephemeral: true,
		}).catch(() => {});
	}

	if (!this.commands.has(interaction.commandName)) {
		return interaction.reply({
			content: 'Looks like we can\'t find that command! We are most likely updating Frodo so please try again later',
			ephemeral: true,
		}).catch(() => {});
	}

	const command = this.commands.get(interaction.commandName);
	const message = await getMessage(interaction);

	try {
		if (command.run.prototype instanceof CommandBase) {
			const CommandClass = command.run;
			const commandRun = new CommandClass({
				message,
				options: interaction.options,
				interaction,
				client: this,
			});
			if (!commandRun.registerCommand) return;
			this.buttonManager.addCommand(interaction.guild.id, interaction.channel.id, interaction.id, commandRun);
		} else {
			command.run(message, interaction.options, interaction);
		}
	} catch (err) {
		handleError(err, interaction);
	}
}
