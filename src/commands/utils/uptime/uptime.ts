import {FrodoClient, Message} from '../../../core/FrodoClient.js';

export default function(this: FrodoClient, message: Message) {
	message.edit(`Frodo started <t:${Math.round(this.startTime / 1000)}:R>`);
}
