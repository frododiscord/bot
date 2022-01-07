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
	commandsNeedToUpdate: boolean;

	constructor(localCommands: Command[], client: FrodoClient) {
		this.client = client;
		this.discordCommands = [];
		this.commandsNeedToUpdate = false;
		this.start(localCommands);
	}

	private async start(localCommands) {
		this.localCommands = this.turnCommandsToArray(localCommands);
		this.discordCommands = this.turnCommandsToArray(await this.getCurrentDiscordCommands());

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
		const discordCommandsResponse = await (process.env.RUNTIME ? this.client.application.commands.fetch() : this.client.guilds.cache.get('839919274395303946').commands.fetch());

		discordCommandsResponse.forEach((command) => {
			discordCommands.push(command);
		});

		return discordCommands;
	}

	private compareCommands() {
		this.client.debugLog('Comparing Local and Discord commands');
		const commandsEqual = JSON.stringify(this.localCommands) === JSON.stringify(this.discordCommands);
		if (!commandsEqual) {
			this.client.debugLog('Local and Discord commands are different, re-uploading commands');
			this.registerCommands();
		} else {
			this.client.debugLog('Commands don\'t need to be updated');
		}
	}

	private async registerCommands() {
		const rest = new REST({version: '9'})
			.setToken(process.env.TOKEN);

		const commandList = [];

		for (const command of this.localCommands) {
			commandList.push(commandToJson(command));
		};

		const route = process.env.RUNTIME ? Routes.applicationCommands(process.env.CLIENTID || '734746193082581084') : Routes.applicationGuildCommands(process.env.CLIENTID, '839919274395303946');
		await rest.put(route, {body: commandList});

		this.client.debugLog('Commands successfully registered');
	}
}
