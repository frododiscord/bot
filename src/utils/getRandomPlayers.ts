import {RandomPlayers} from '../core/RandomPlayers';
import {RandomPlayersError} from '../core/RandomPlayersError.js';
import {Interaction} from '../FrodoClient';


export function getRandomPlayers(interaction: Interaction, randomList: boolean): RandomPlayers | RandomPlayersError {
	const num = Math.round(Math.random());
	const randomPlayers = [];
	const playerOne = interaction.user;
	const playerTwo = interaction.options.getUser('playertwo') || interaction.options.getUser('user');

	if (!playerOne || !playerTwo) return RandomPlayersError.PlayerNotFound;
	if (playerOne.id === playerTwo.id) return RandomPlayersError.SamePlayer;
	if (playerOne.bot || playerTwo.bot) return RandomPlayersError.BotPlayer;

	if (num === 0 || !randomList) {
		randomPlayers.push(playerOne);
		randomPlayers.push(playerTwo);
	} else {
		randomPlayers.push(playerTwo);
		randomPlayers.push(playerOne);
	}

	return {
		randomPlayers,
		playerOne,
		playerTwo,
	};
}
