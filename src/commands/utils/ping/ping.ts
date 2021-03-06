import {MessageHandler} from '../../../core/ErrorHandling/CommandHandler';
import {FrodoClient, Interaction, Options} from '../../../core/FrodoClient';

export default function(this: FrodoClient, message: MessageHandler, options: Options, interaction: Interaction) {
	const content = [
		`Bot Ping: \`${message.message.createdTimestamp - interaction.createdTimestamp}ms\``,
		`API Ping: \`${Math.round(this.ws.ping)}ms\``,
	];
	message.edit(content.join('\n'));
}
