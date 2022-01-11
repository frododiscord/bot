import {Insult} from './Insult.d';
import getJson from '../../../core/GetJson.js';
import {FrodoClient, Message, Options} from '../../../core/FrodoClient';

export default async function(this: FrodoClient, message: Message, options: Options) {
	let text = '';
	if (options.getUser('user')) text = `${options.getUser('user')} :fire: `;

	await getJson('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((insult: Insult) => message.edit(`${text}${insult.insult}`))
		.catch(() => message.edit('We could not find you a insult :confused:'));
}
