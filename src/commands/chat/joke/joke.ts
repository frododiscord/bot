import {Joke} from './Joke.d';
import getJson from '../../../core/GetJson.js';
import {FrodoClient, Message} from '../../../core/FrodoClient';

export default async function(this: FrodoClient, message: Message) {
	await getJson('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
		.then((joke: Joke) => {
			if (joke.setup) {
				message.edit(`${joke.setup}\n${joke.delivery}`);
			} else if (joke.joke) {
				message.edit(`${joke.joke}`);
			}
		})
		.catch(() => message.edit('We could not find you a joke :confused:'));
}
