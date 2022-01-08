import {ContextMenuCommand} from '../namespaces/ContextMenuCommand';

export const contextMenuCommands: ContextMenuCommand[] = [
	{
		name: 'Send an insult!',
		type: 'USER',
	},
	{
		name: 'Play tic tac toe',
		type: 'USER',
	},
];

export const contextMenuCommandsMap = {
	'Send an insult!': 'insult',
	'Play tic tac toe': 'ttt',
};
