import {EMBEDCOLOR} from './../../../utils/globalConstants.js';
import {region, buttons, backButton, winButtons} from './emojis.js';
import {CommandBaseOptions} from './../../../namespaces/CommandBaseOptions.d';
import CommandBase from '../../../utils/CommandBase.js';
import {Aki} from 'aki-api';
import {MessageEmbed, ButtonInteraction} from 'discord.js';
import {guess} from 'aki-api/typings/src/functions';

export default class Akinator extends CommandBase {
	aki: Aki;
	currentGuess: number;
	hasWon = false;
	choiceMade: boolean;
	finished: boolean;

	constructor(options: CommandBaseOptions) {
		super(options);

		this.aki = new Aki({region, childMode: false});
		this.choiceMade = false;
		this.finished = false;
		this.currentGuess = 0;

		this.runGame();
	}

	async runGame() {
		await this.aki.start();
		await this.updateMessage();
	}

	async updateMessage() {
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setTitle('Akinator:')
					.setColor(EMBEDCOLOR)
					.setThumbnail('https://frodo.fun/static/img/frodoAssets/aki.png')
					.addFields(
						{name: 'Question:', value: this.aki.question},
						{name: 'Progress:', value: String(this.aki.progress)},
					),
			],
			components: [
				this.makeButtonRow(...buttons),
				this.makeButtonRow(backButton),
			],
		});
	}

	async win() {
		await this.updateWinMessage('Am I right?', 0);

		this.winStep();
	}

	async winStep() {
		await this.updateWinMessage('Am I right?', this.currentGuess);
		this.currentGuess++;
	}

	async updateWinMessage(description: string, i: number) {
		const answers: guess = <guess> this.aki.answers[i];
		let winButtonsOnMessage = winButtons;
		if (this.finished) {
			winButtonsOnMessage = winButtons.map((value) => {
				value.disabled = true;
				return value;
			});
			this.finishCommand();
		}
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setTitle('Akinator:')
					.setColor('#3498db')
					.addFields(
						{name: 'Name:', value: answers.name},
						{name: 'Description:', value: answers.description},
					)
					.setImage(answers.absolute_picture_path)
					.setThumbnail('https://frodo.fun/static/img/frodoAssets/aki.png'),
			],
			components: [
				this.makeButtonRow(...winButtonsOnMessage),
			],
			content: description,
		});
	}

	async onButtonClick(id, interaction: ButtonInteraction) {
		if (this.finished) return;

		if (interaction.user.id !== this.interaction.user.id) {
			interaction.reply({
				content: 'Only one person can play, run `/akinator` for your own game',
				ephemeral: true,
			}).catch(() => {});
			return;
		}

		if (id > 10) {
			if (id == 11) {
				this.finished = true;
				this.updateWinMessage('I win again!', this.currentGuess - 1);
				this.choiceMade = true;
			} else if (id == 12) {
				if (this.currentGuess < this.aki.guessCount && !this.choiceMade) {
					await this.winStep();
				} else {
					this.finished = true;
					await this.updateWinMessage('I don\'t know, you win!', this.aki.guessCount - 1);
				}
			}
			return true;
		} else {
			if (id == 5) {
				await this.aki.back();
			} else {
				await this.aki.step(id);
			}
		}

		await this.updateMessage();

		if (this.aki.progress >= 75 || this.aki.currentStep >= 78) {
			await this.aki.win();
			this.hasWon = true;
			await this.win();
			return;
		}
	}
}
