import {Client, Collection, CommandInteraction, CommandInteractionOptionResolver, ButtonInteraction} from 'discord.js';
import chalk from 'chalk';

import {MessageHandler} from './utils/ErrorHandling/CommandHandler.js';
import CommandRegister from './utils/CommandRegister.js';
import ButtonManager from './utils/ButtonManager.js';
import CommandBase from './utils/CommandBase.js';

import * as commands from './commands/commands.js';
import * as events from './events/events.js';

export class FrodoClient extends Client {
	commands: Collection<string, any>;
	startTime: number;
	commandRegister: CommandRegister;
	buttonManager: ButtonManager;

	constructor(args?) {
		super(args);
		this.commands = new Collection();
		this.startTime = Date.now();
		this.loadCommands();
	}

	private async loadCommands() {
		this.debugLog('Registering commands');
		for (const command of Object.values(commands)) {
			this.debugLog(` -> Loading command ${command.name}`);
			const handler = command.handler.prototype instanceof CommandBase ? command.handler : command.handler.bind(this);
			const commandData = {data: command, run: handler};
			this.commands.set(command.name, commandData);
		}

		this.connectToDiscord();
	}

	private registerCommands() {
		this.debugLog('Making command register instance');

		const commandArray = [];
		this.commands.forEach((command) => {
			commandArray.push(command.data);
		});

		this.commandRegister = new CommandRegister(commandArray, this);
	}

	private async connectToDiscord() {
		this.debugLog('Attempting to login...');
		await this.login(process.env.TOKEN);
		this.debugLog('Logged into Discord');
		this.registerCommands();
		this.registerEvents();
		this.createButtonManager();
	}

	private async registerEvents() {
		this.debugLog('Registering events');
		for (const event of Object.values(events)) {
			this.debugLog(` -> Registering event ${event.name} (${event.identifier})`);
			this.on(event.name, event.handler.bind(this));
		}

		this.debugLog('Events registered');
		this.finishDiscordLogin();
	}

	private finishDiscordLogin() {
		this.debugLog('Finished logging into Discord');
		if (this.commandRegister.processFinished) return this.completeFinishLogin();
		this.commandRegister.setCompleteEvent(this.completeFinishLogin.bind(this));
	}

	private completeFinishLogin() {
		this.debugLog(`Started in ${this.timeSinceStart / 1000} second${this.timeSinceStart / 1000 === 1 ? '' : 's'}`);
	}

	private createButtonManager() {
		this.debugLog('Creating button manager');
		this.buttonManager = new ButtonManager(this);
	}

	public get timeSinceStart() {
		return Date.now() - this.startTime;
	}

	public getServerCount(): number {
		return this.guilds.cache.size;
	}

	public debugLog(message) {
		console.log(`[${chalk.blue('DEBUG')}][${chalk.yellow(this.timeSinceStart)}] ${message}`);
	}
}

export {MessageHandler as Message, CommandInteractionOptionResolver as Options, CommandInteraction as Interaction, ButtonInteraction};
