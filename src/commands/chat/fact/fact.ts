import {FrodoClient, Message} from '../../../core/FrodoClient';
import {Fact} from './Fact.d';
import getJson from '../../../core/GetJson.js';

export default async function(this: FrodoClient, message: Message) {
	await getJson('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((fact: Fact) => message.edit(fact.text))
		.catch(() => message.edit('We could not find you a fact :confused:'));
}
