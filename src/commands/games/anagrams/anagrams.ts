import {CommandBaseOptions} from './../../../namespaces/CommandBaseOptions.d';
import CommandBase from '../../../utils/CommandBase.js';
import {MessageEmbed, MessageEditOptions, Message} from 'discord.js';
import {buttons, vowelsRarity, consonantsRarity} from './emojis.js';
import wait from '../../../utils/wait.js';
import getJson from '../../../utils/getJson.js';

function getLetterRarity(rarity) {
	const letters = [];
	Object.keys(rarity).forEach((letter) => {
		for (let i = 0; i < rarity[letter]; i++) {
			letters.push(letter);
		}
	});
	return letters;
}

const vowels = getLetterRarity(vowelsRarity);
const consonants = getLetterRarity(consonantsRarity);

export default class Anagrams extends CommandBase {
	letters: string;
	collectingLetters: boolean;

	constructor(options: CommandBaseOptions) {
		super(options);
		this.runGame();
	}

	async runGame() {
		this.letters = '';
		this.collectingLetters = true;
		await this.updateMessage('');
	}

	async updateMessage(playAttachment: string, addButtons: boolean = true) {
		const messageData: MessageEditOptions = {
			embeds: [
				new MessageEmbed()
					.setTitle('Countdown')
					.setColor('#3498db')
					.addFields(
						{
							name: 'How to Play:',
							value: 'You must choose nine letters by pressing either the vowel or Consonant button. You will then have 30 seconds to find the largest word you can.',
						},
						{name: 'Play:', value: (this.letters == '' ? '...' : this.letters) + (playAttachment ? `\n${playAttachment}` : '')},
					),
			],
		};
		messageData.components = addButtons ? [this.makeButtonRow(...buttons)] : [];

		await this.message.edit(messageData);
	}

	async startTimer() {
		await wait(30000);
		await this.updateMessage('Now type the longest word you got', false);
		const filter = (m: Message) => m.author.id === this.interaction.user.id;
		const messageCollection = await this.message.channel.awaitMessages({filter, max: 1});
		const message = messageCollection.first();
		await message.deletable ? message.delete() : null;
		const word = message.content;

		try {
			const solved = await getJson(`http://www.anagramica.com/all/:${this.letters.toLocaleLowerCase()}`);
			await this.updateMessage(
				`Your choice of ${word} was ${solved.all.includes(word.toLowerCase()) ? 'an' : 'not an'} option. To see a full list of words click [here](https://word.tips/unscramble/${this.letters})`,
				false,
			);
		} catch (e) {
			await this.message.edit({
				embeds: [
					new MessageEmbed()
						.setTitle('Countdown')
						.setDescription(`Something has gone wrong! To see a full list of words click [here](https://word.tips/unscramble/${this.letters})`)
						.setColor('#ff0000'),
				],
			});
		}
		this.finishCommand();
	}

	public async onButtonClick(buttonId: string) {
		if (!this.collectingLetters) return;

		const randomLetter = buttonId === '0' ? vowels[Math.floor(Math.random() * vowels.length)] : consonants[Math.floor(Math.random() * consonants.length)];
		this.letters += randomLetter;

		if (this.letters.length >= 9) {
			this.collectingLetters = false;
			this.startTimer();
		}

		await this.updateMessage(this.collectingLetters ? '' : 'Your 30 seconds starts now!', this.collectingLetters);
	}
}
