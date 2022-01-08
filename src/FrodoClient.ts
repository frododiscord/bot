import {MessageHandler} from './utils/ErrorHandling/CommandHandler.js';
import {Client, Collection, CommandInteraction, CommandInteractionOptionResolver} from 'discord.js';
import {readdirSync} from 'fs';
import CommandRegister from './utils/CommandRegister.js';
import chalk from 'chalk';

export {MessageHandler as Message, CommandInteractionOptionResolver as Options, CommandInteraction as Interaction};

export class FrodoClient extends Client {
	commands: Collection<string, any>;
	startTime: number;
	commandRegister: CommandRegister;

	constructor(args?) {
		super(args);
		this.commands = new Collection();
		this.startTime = Date.now();
		this.loadCommands();
	}

	private async loadCommands() {
		const commandFiles = readdirSync('./src/commands');
		let commands;
		let command;
		let run;
		let commandData;
		for (const dir of commandFiles) {
			this.debugLog(`Loading commands from file ${dir}`);
			commands = readdirSync(`./src/commands/${dir}`);
			for (const file of commands) {
				command = (await import(`./commands/${dir}/${file}/command.js`)).command;
				if (command.main) {
					run = (await import(`./commands/${dir}/${file}/${command.main || 'index.js'}`)).default;
				}
				this.debugLog(` -> Loading command ${file}`);
				commandData = {
					data: command,
				};
				if (command.main) commandData.run = run.bind(this);
				this.commands.set(command.name, commandData);
			}
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
	}

	private async registerEvents() {
		this.debugLog('Registering events');
		const eventFolders = readdirSync('./src/events');
		let event;
		for (const eventName of eventFolders) {
			const eventFiles = readdirSync(`./src/events/${eventName}`);
			for (const eventFile of eventFiles) {
				if (!eventFile.endsWith('.js')) continue;
				event = (await import(`./events/${eventName}/${eventFile}`)).default;
				this.debugLog(` -> Registering event ${eventName} (${eventFile})`);
				this.on(eventName, event.bind(this));
			}
		}

		this.debugLog('Events registered');
		this.finishDiscordLogin();
	}

	private finishDiscordLogin() {
		this.debugLog('Finished logging into Discord');
		this.debugLog(`Started in ${this.timeSinceStart / 1000} seconds`);
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
