import {Interaction} from 'discord.js';
import {FrodoClient} from '../../FrodoClient';

export default async function(this: FrodoClient, interaction: Interaction) {
	if (!interaction.isButton()) return;
}
