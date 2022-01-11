import {ButtonObject} from '../core/ButtonObject';
import {FrodoClient} from './FrodoClient';
import CommandBase from './CommandBase.js';

export default class ButtonManager {
	client: FrodoClient;
	commandData: ButtonObject;

	constructor(client: FrodoClient) {
		this.client = client;
		this.commandData = {};
	}

	addCommand(serverId: string, channelId: string, interactionId: string, command: CommandBase) {
		if (!this.commandData[serverId]) this.commandData[serverId] = {};
		if (!this.commandData[serverId][channelId]) this.commandData[serverId][channelId] = {};
		this.commandData[serverId][channelId][interactionId] = command;
	}

	getCommand(serverId: string, channelId: string, interactionId: string): CommandBase {
		return this.commandData?.[serverId]?.[channelId]?.[interactionId];
	}

	deleteCommand(serverId: string, channelId: string, interactionId: string) {
		if (!this.commandData?.[serverId]?.[channelId]?.[interactionId]) return;
		this.commandData[serverId][channelId][interactionId] = undefined;
	}
}
