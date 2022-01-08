import {Interaction, MessageEmbed} from 'discord.js';
import {FrodoClient} from '../../FrodoClient';

export default async function(this: FrodoClient, interaction: Interaction) {
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
		await interaction.deferUpdate().catch(() => {});
		await command.onButtonClick(buttonId, interaction);
	}
}
