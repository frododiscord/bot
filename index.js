// Requiring dependancies
const { Client, Collection } = require('discord.js'); // Requiring discord.js library for use in this file
const { readdirSync } = require('fs'); // For reading the commands directory
const Enmap = require('enmap'); // For per server config
const { sep } = require('path'); // For reading subfolders in commands directory
const { generateEmbed, commandUsage } = require('./utils'); // Importing the embed function from utils to prevent reused code
const { token } = require('./config.json'); // Loading the token from our config file

const client = new Client();

// Creating a new commands and cooldowns collection so they can be accessed later
client.commands = new Collection();
const cooldowns = new Collection();
// Creating a settings Enmap for per server configs
client.settings = new Enmap({
    name: 'settings',
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep',
});
// Creating a default settings variable to use if no per-server configs are presant
const defaultSettings = {
    prefix: '.',
    joinRole: 'Member',
    jokeFilters: 'nsfw,religious,political,racist,sexist',
};

const dir = './commands/';

// Reading through our commands folder and all of its subfolders
readdirSync(dir).forEach(dirs => {
    const commandFiles = readdirSync(`${dir}${sep}/${dirs}${sep}`);
    for (const file of commandFiles) {
        // Looping through the files and requiring them
        const pull = require(`${dir}${dirs}/${file}`);
        if (typeof pull.name !== 'undefined') client.commands.set(pull.name, pull); // Checking if the command exists and adding it to the collection
    }
});

client.once('ready', () => {
    // Logging ready and setting the activity to Playing .help when the bot has loaded
    console.log('Ready!');
    client.user.setActivity('.help', { type: 'PLAYING' });
});

client.on('guildDelete', guild => {
    // Deleting guild settings if the bot is removed to prevent stagnent entries
    client.settings.delete(guild.id);
});

client.on('guildCreate', guild => {
    // Sends a welcome message to the owner when a new server is joined and console logs info about it
    guild.owner.send(generateEmbed(`Thanks for adding me to your server ${guild.name}, my default prefix is .`, 'Type .help to see a full list of commands. Have fun!', '#3498db', true));
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on('message', message => {
    if (message.author.bot) return; // Stops if the message is by a bot

    let prefix;
    if (message.channel.type === 'dm') {
        prefix = defaultSettings.prefix;
    } else {
        client.settings.ensure(message.guild.id, defaultSettings);
        prefix = client.settings.get(message.guild.id, 'prefix');// Gets the prefix
    }

    if (message.content.indexOf(prefix) !== 0) return; // Stops if the message does not begin with the prefix

    const args = message.content.split(/\s+/g);
    const commandName = args.shift().slice(prefix.length).toLowerCase();
    // Puts the arguments into an array and sets the command in a variable
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return; // Stops if there is no command

    if (command.guildOnly && message.channel.type === 'dm') return message.reply('I cannot run that command inside DMs!'); // Stops if the command command is set to not run in DMs

    if (command.userPermissions) {
        for (let permission in command.userPermissions) {
            // Stops if the user does not have the permissions set in the command
            if (!message.member.hasPermission(command.userPermissions[permission])) return message.reply('You do not have permission to run that command');
        }
    }

    if (command.args && !args.length) {
        // Sends an embed with the usage for a command if they did not provide arguments
        return message.reply(generateEmbed(`You didn't provide any arguments. Usage:`, commandUsage(command), '#3498db', true, false));
    }

    // Cooldown Checking
    // Adds the user to the cooldowns list when they send a command
    if (!cooldowns.has(message.author.id)) cooldowns.set(command.name, new Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) { // Checks if the message author is in the timestamps var
        // Sets the time the command will come off cooldown
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} ${timeLeft.toFixed(1) <= 1 ? 'second' : 'seconds'} before reusing the command ${command.name} command.`);
        }
    }

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error while trying to execute that command');
    }
});

// Logic for when I run in debug mode
if (process.env.DEBUG) {
    console.log('Running in debug mode');
    process.on('unhandledRejection', e => { throw e; });
}

client.login(token);
