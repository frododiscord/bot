import {Interaction, Message, Options, FrodoClient} from './FrodoClient';

export interface CommandBaseOptions {
	message: Message;
	options: Options;
	interaction: Interaction;
	client: FrodoClient;
}
