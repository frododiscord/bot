import {EMBEDCOLOR} from '../../../core/GlobalConstants.js';
import {MessageEmbed, User} from 'discord.js';
import {FrodoClient, Interaction, Message, Options} from '../../../core/FrodoClient.js';

export default function(this: FrodoClient, message: Message, options: Options, interaction: Interaction) {
	const user: User = options.getUser('user') || interaction.user;
	message.edit({
		embeds: [
			new MessageEmbed()
				.setTitle(`${user.username}'s avatar:`)
				.setColor(EMBEDCOLOR)
				.setImage(user.avatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png'),
		],
	});
}
