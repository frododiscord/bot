import chalk from 'chalk';
import {Client, Collection, CommandInteraction, CommandInteractionOptionResolver, ButtonInteraction} from 'discord.js';

import {MessageHandler} from './ErrorHandling/CommandHandler.js';
import CommandRegister from './CommandRegister.js';
import ButtonManager from './ButtonManager.js';
import CommandBase from './CommandBase.js';

import * as commands from '../commands/commands.js';
import * as events from '../events/events.js';

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

	private createCommandRegister() : FrodoClient {
		this.debugLog('Making command register instance');
		const commandArray = [];
		this.commands.forEach((command) => {
			commandArray.push(command.data);
		});

		this.commandRegister = new CommandRegister(commandArray, this);
		return this;
	}

	private async connectToDiscord() {
		this.debugLog('Attempting to login to discord...');
		await this.login(process.env.TOKEN);
		this.debugLog('Logged into Discord');
		await this.createCommandRegister().registerEvents();
		this.debugLog('Creating button manager');
		this.buttonManager = new ButtonManager(this);
	}

	private async registerEvents() : Promise<FrodoClient> {
		this.debugLog('Registering events');
		for (const event of Object.values(events)) {
			this.debugLog(` -> Registering event ${event.name} (${event.identifier})`);
			this.on(event.name, event.handler.bind(this));
		}

		this.debugLog('Events registered');
		this.finishDiscordLogin();
		return this;
	}

	private finishDiscordLogin() {
		this.debugLog('Finished logging into Discord');
		if (this.commandRegister.processFinished) {
			this.completeFinishLogin();
			return;
		}
		this.commandRegister.setCompleteEvent(this.completeFinishLogin.bind(this));
	}

	private completeFinishLogin() {
		this.debugLog(`Started in ${this.timeSinceStart / 1000} second${this.timeSinceStart == 1000 ? '' : 's'}`);
	}

	public get timeSinceStart(): number {
		return Date.now() - this.startTime;
	}

	public get serverCount(): number {
		return this.guilds.cache.size;
	}

	public debugLog(message) {
		console.log(`[${chalk.blue('DEBUG')}][${chalk.yellow(this.timeSinceStart)}] ${message}`);
	}
}

export {MessageHandler as Message, CommandInteractionOptionResolver as Options, CommandInteraction as Interaction, ButtonInteraction};
