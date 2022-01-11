import CommandBase from '../../utils/CommandBase.js';
import {contextMenuCommandsMap} from '../../contextMenu/contextMenuCommands.js';
import {Event} from '../../core/Event.js';
import {FrodoClient, Interaction} from '../../FrodoClient';
import {getMessage} from '../../utils/messageHandler.js';
import {handleError} from '../../utils/ErrorHandling/ErrorHandler.js';

export const event : Event = {
	name: 'interactionCreate',
	identifier: 'contextHandler',
	handler: contextHandler,
};


async function contextHandler(this: FrodoClient, interaction: Interaction) {
	if (!interaction.isContextMenu()) return;

	if (!interaction.guild) {
		return interaction.reply({
			content: 'This command is not available in DMs, please try again in a server',
			ephemeral: true,
		}).catch(() => {});
	}

	interaction.commandName = contextMenuCommandsMap[interaction.commandName];
	if (!interaction.commandName) return;

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
