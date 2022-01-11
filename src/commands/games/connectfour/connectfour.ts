import {ButtonValidate} from '../../../core/ButtonValidate.js';
import {EMBEDCOLOR} from './../../../utils/globalConstants.js';
import {CommandBaseOptions} from '../../../core/CommandBaseOptions';
import CommandBase from '../../../utils/CommandBase.js';
import {ButtonInteraction, MessageEmbed, User} from 'discord.js';
import {buttonsRowOne, buttonsRowTwo, gridDimensions, playerTextClear, slotText, SlotType} from './emojis.js';

export default class ConnectFour extends CommandBase {
	players: User[];
	currentPlayer: User;
	grid: SlotType[][];
	isPlayerOne: boolean;

	playerOne: User;
	playerTwo: User;

	running: boolean;

	constructor(options: CommandBaseOptions) {
		super(options);

		const playersList = this.getRandomPlayers();
		if (!playersList) return;
		this.players = playersList.randomPlayers;
		this.playerOne = playersList.playerOne;
		this.playerTwo = playersList.playerTwo;

		this.currentPlayer = this.players[0];
		this.isPlayerOne = true;
		this.grid = [];

		this.running = true;

		this.runGame();
	}

	async runGame() {
		this.generateGrid();
		this.updateMessage(true);
	}

	generateGrid() {
		for (let i = 0; i < gridDimensions.y; i++) {
			for (let j = 0; j < gridDimensions.x; j++) {
				if (!this.grid[i]) this.grid.push([]);
				this.grid[i].push(SlotType.Empty);
			}
		}
	}

	updateMessage(start?) {
		let message = '';
		this.grid.forEach((i: SlotType[]) => {
			i.forEach((j: SlotType) => {
				message += slotText[j];
			});

			message += '\n';
		});

		message += '<:l1:851065666341699584><:l2:851065679682469888><:l3:851065688436899861><:l4:851065697873690654><:l5:851065706735992893><:l6:851065718644801546><:l7:851065729570963456><:l8:851065741817675796>';

		start ? this.message.edit({
			content: `${this.playerOne} challenged ${this.playerTwo} to a game of Connect Four!`,
			embeds: [
				new MessageEmbed()
					.setColor(EMBEDCOLOR)
					.setDescription(`Current go: ${playerTextClear[this.isPlayerOne ? 0 : 1]} ${this.isPlayerOne ? this.players[0] : this.players[1]}\n\n${message}`),
			],
			components: [
				this.makeButtonRow(...buttonsRowOne),
				this.makeButtonRow(...buttonsRowTwo),
			],
		}) : this.message.edit({
			content: `${this.playerOne} challenged ${this.playerTwo} to a game of Connect Four!`,
			embeds: [
				new MessageEmbed()
					.setColor(EMBEDCOLOR)
					.setDescription(`Current go: ${playerTextClear[this.isPlayerOne ? 1 : 0]} ${this.isPlayerOne ? this.players[1] : this.players[0]}\n\n${message}`),
			],
			components: [
				this.makeButtonRow(...buttonsRowOne),
				this.makeButtonRow(...buttonsRowTwo),
			],
		});
	}

	checkWinWithModifiers(column: number, row: number, columnModifier: number, rowModifier: number) {
		let streak = 0;

		for (let y = -3; y < 4; y++) {
			const rowIndex = row + (y * rowModifier);
			const columnIndex = column + (y * columnModifier);
			const gridValue: SlotType = this.grid[rowIndex]?.[columnIndex];
			if (gridValue === undefined) continue;

			if (gridValue == (this.isPlayerOne ? SlotType.PlayerOne : SlotType.PlayerTwo)) {
				streak++;
				if (streak == 4) return true;
			} else {
				streak = 0;
			}
		}

		return false;
	}

	checkWin(column: number, row: number): boolean {
		return (
			this.checkWinWithModifiers(column, row, 0, 1) ||
			this.checkWinWithModifiers(column, row, 1, 0) ||
			this.checkWinWithModifiers(column, row, 1, 1) ||
			this.checkWinWithModifiers(column, row, 1, -1)
		);
	}

	async win() {
		this.updateMessageWin();
		this.finishCommand();
	}

	updateMessageWin() {
		let message = '';
		this.grid.forEach((i: SlotType[]) => {
			i.forEach((j: SlotType) => {
				message += slotText[j];
			});

			message += '\n';
		});

		message += '<:l1:851065666341699584><:l2:851065679682469888><:l3:851065688436899861><:l4:851065697873690654><:l5:851065706735992893><:l6:851065718644801546><:l7:851065729570963456><:l8:851065741817675796>';

		this.message.edit({
			content: `${this.playerOne} challenged ${this.playerTwo} to a game of Connect Four!\n\n${this.isPlayerOne ? this.players[0] : this.players[1]} Won!\n`,
			embeds: [
				new MessageEmbed()
					.setColor(EMBEDCOLOR)
					.setDescription(`\n${message}`),
			],
			components: [],
		});
	}

	public onButtonClick(buttonId: string): void {
		if (!this.running) return;

		const columnNumber = parseInt(buttonId);
		let rowNumber = gridDimensions.y - 1;

		for (let i = gridDimensions.y - 1; i >= 0; i--) {
			if (this.grid[i][columnNumber] == SlotType.Empty) {
				this.grid[i][columnNumber] = this.isPlayerOne ? SlotType.PlayerOne : SlotType.PlayerTwo;
				break;
			}

			rowNumber--;
		}

		if (this.checkWin(columnNumber, rowNumber)) {
			this.running = false;
			this.win();
			return;
		}

		this.updateMessage();

		this.isPlayerOne = !this.isPlayerOne;
		this.currentPlayer = this.isPlayerOne ? this.players[0] : this.players[1];
	}

	public validateButtonClick(buttonId: string, interaction: ButtonInteraction): ButtonValidate {
		if (interaction.user === this.currentPlayer) return ButtonValidate.Run;
		const playerIds = this.players.map((i) => i.id);
		if (playerIds.includes(interaction.user.id)) return ButtonValidate.Ignore;
		return ButtonValidate.Message;
	}
}
