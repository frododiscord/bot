import {ButtonValidate} from '../../core/ButtonValidate.js';
import {Interaction, MessageEmbed} from 'discord.js';
import {FrodoClient} from '../../FrodoClient';
import {Event} from '../../core/Event.js';

export const event : Event = {
	name: 'interactionCreate',
	identifier: 'buttonHandler',
	handler: buttonHandler,
};

async function buttonHandler(this: FrodoClient, interaction: Interaction) {
	if (!interaction.isButton()) return;

	const [interactionId, buttonId] = interaction.customId.split(':');
	const command = this.buttonManager.getCommand(
		interaction.guild.id,
		interaction.channel.id,
		interactionId,
	);

	if (!command) {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor('#ff0000')
					.setDescription('Error: Please run the command again\nIf you think you have found a bug, please report it on https://help.frodo.fun'),
			],
			ephemeral: true,
			components: [],
		}).catch(() => {});
	} else {
		const buttonAction: ButtonValidate = command.validateButtonClick(buttonId, interaction);
		if (buttonAction !== ButtonValidate.Message) {
			await interaction.deferUpdate().catch(() => {});
		}
		if (buttonAction === ButtonValidate.Run) {
			await command.onButtonClick(buttonId);
		} else if (buttonAction === ButtonValidate.Message) {
			interaction.reply({
				content: `Only one person can play, run \`/${command.interaction.commandName}\` for your own game`,
				ephemeral: true,
			}).catch(() => {});
		}
	}
}
