import dotenv from 'dotenv';

import {Intents} from 'discord.js';
import {FrodoClient} from './core/FrodoClient.js';

dotenv.config();

// eslint-disable-next-line no-unused-vars
const client = new FrodoClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	],
});
