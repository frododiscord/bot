import {FrodoClient, Message} from '../../../core/FrodoClient';
import getJson from '../../../core/GetJson.js';

export default async function(this: FrodoClient, message: Message) {
	await getJson('https://fortuneapi.herokuapp.com/')
		.then((fortune) => message.edit(fortune))
		.catch(() => message.edit('We could not find you a fortune :confused:'));
}
