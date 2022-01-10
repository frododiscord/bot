import {ContextMenuCommand} from './../namespaces/ContextMenuCommand.d';
import {CommandRegisterData} from './../namespaces/CommandRegister.d';
import {FrodoClient} from './../FrodoClient';
import {Command} from './../namespaces/Command.d';
import {Routes} from 'discord-api-types/v9';
import {REST} from '@discordjs/rest';
import {commandToJson} from './commandToJson.js';

export default class CommandRegister {
	client: FrodoClient;

	localCommands: CommandRegisterData[];
	discordCommands: CommandRegisterData[];

	localContextCommands: ContextMenuCommand[];
	discordContextCommands: ContextMenuCommand[];

	commandsNeedToUpdate: boolean;
	typeMap: any;

	processFinished: boolean;
	completeEvent: () => void;

	constructor(localCommands: Command[], client: FrodoClient) {
		this.client = client;
		this.discordCommands = [];
		this.commandsNeedToUpdate = false;
		this.processFinished = false;
		this.typeMap = {
			USER: 2,
			MESSAGE: 3,
		};
		this.completeEvent = () => {};

		this.start(localCommands);
	}

	private async start(localCommands) {
		this.localCommands = this.turnCommandsToArray(localCommands);
		this.localContextCommands = await this.getLocalContextCommands();

		const [discordCommands, discordContextCommands] = await this.getCurrentDiscordCommands();
		this.discordCommands = this.turnCommandsToArray(discordCommands);
		this.discordContextCommands = this.turnContextCommandsToArray(discordContextCommands);

		this.compareCommands();
	}

	private turnCommandsToArray(commands): CommandRegisterData[] {
		const newCommands: CommandRegisterData[] = [];

		Object.keys(commands).forEach((commandId) => {
			const command = commands[commandId];
			const newIndex = newCommands.push({
				name: command.name,
				description: command.description,
			});

			if (command.options?.length > 0) {
				newCommands[newIndex - 1].options = command.options;
			}
		});

		newCommands.sort((a, b) => a.name.localeCompare(b.name));

		newCommands.forEach((command, index) => {
			if (command.options) {
				newCommands[index].options = command.options.map((value) => ({
					name: value.name,
					description: value.description,
					type: value.type,
					required: value.required,
				}));
			}
		});

		return newCommands;
	}

	private async getCurrentDiscordCommands() {
		const discordCommands = [];
		const discordContextCommands = [];

		const discordCommandsResponse = await (process.env.RUNTIME ? this.client.application.commands.fetch() : this.client.guilds.cache.get('839919274395303946').commands.fetch());

		discordCommandsResponse.forEach((command) => {
			if (command.type === 'USER' || command.type === 'MESSAGE') {
				command.type = this.typeMap[command.type];
				discordContextCommands.push(command);
			} else discordCommands.push(command);
		});

		return [discordCommands, discordContextCommands];
	}

	private compareCommands() {
		if (process.argv.includes('--update-commands')) {
			this.client.debugLog('--update-commands flag detected, updating commands');
			return this.registerCommands();
		}

		this.client.debugLog('Comparing Local and Discord commands');
		const commandsEqual = JSON.stringify(this.localCommands) === JSON.stringify(this.discordCommands);
		const contextCommandsEqual = JSON.stringify(this.localContextCommands) === JSON.stringify(this.discordContextCommands);
		if (!commandsEqual || !contextCommandsEqual) {
			this.client.debugLog('Local and Discord commands are different, re-uploading commands');
			this.registerCommands();
		} else {
			this.client.debugLog('Commands don\'t need to be updated');
			this.processFinished = true;
			this.completeEvent();
		}
	}

	private async registerCommands() {
		const rest = new REST({version: '9'})
			.setToken(process.env.TOKEN);

		const commandList = [];

		for (const command of this.localCommands) {
			commandList.push(commandToJson(command));
		}
		for (const command of this.localContextCommands) {
			commandList.push(command);
		}

		const route = process.env.RUNTIME ? Routes.applicationCommands(process.env.CLIENTID || '734746193082581084') : Routes.applicationGuildCommands(process.env.CLIENTID, '839919274395303946');
		await rest.put(route, {body: commandList});

		this.client.debugLog('Commands successfully registered');
		this.processFinished = true;
		this.completeEvent();
	}

	private turnContextCommandsToArray(commands) {
		const newCommands: ContextMenuCommand[] = [];

		Object.keys(commands).forEach((commandId) => {
			const command = commands[commandId];
			newCommands.push({
				name: command.name,
				type: command.type,
			});
		});

		newCommands.sort((a, b) => a.name.localeCompare(b.name));

		return newCommands;
	}

	private async getLocalContextCommands() {
		const commands = await import('./../contextMenu/contextMenuCommands.js');

		commands.contextMenuCommands.sort((a, b) => a.name.localeCompare(b.name));
		const newCommands = commands.contextMenuCommands.map((value) => {
			value.type = this.typeMap[value.type];
			return value;
		});

		return newCommands;
	}

	public setCompleteEvent(event: () => void) {
		this.completeEvent = event;
	}
}
