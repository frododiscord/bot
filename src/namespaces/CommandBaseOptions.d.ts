import {Interaction, Message, Options} from '../FrodoClient';

export interface CommandBaseOptions {
	message: Message;
	options: Options;
	interaction: Interaction;
}
