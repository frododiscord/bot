import {NUMBEREMOJIS} from './../../../utils/globalConstants.js';
import {Button} from '../../../namespaces/Button';

export enum SlotType {
	Empty,
	PlayerOne,
	PlayerTwo,
}

export const gridDimensions = {
	x: 8,
	y: 8,
};

export const slotText = {
	0: '<:wr:852255175258275841>',
	1: '<:c1:852258262052765706>',
	2: '<:c2:852258272945242172>',
};

export const playerTextClear = {
	0: '<:c1c:852259321134841876>',
	1: '<:c2c:852259332053008384>',
};

export const buttonsRowOne: Button[] = [
	{
		id: '0',
		emoji: {
			id: NUMBEREMOJIS[0].id,
		},
	},
	{
		id: '1',
		emoji: {
			id: NUMBEREMOJIS[1].id,
		},
	},
	{
		id: '2',
		emoji: {
			id: NUMBEREMOJIS[2].id,
		},
	},
	{
		id: '3',
		emoji: {
			id: NUMBEREMOJIS[3].id,
		},
	},
];

export const buttonsRowTwo: Button[] = [
	{
		id: '4',
		emoji: {
			id: NUMBEREMOJIS[4].id,
		},
	},
	{
		id: '5',
		emoji: {
			id: NUMBEREMOJIS[5].id,
		},
	},
	{
		id: '6',
		emoji: {
			id: NUMBEREMOJIS[6].id,
		},
	},
	{
		id: '7',
		emoji: {
			id: NUMBEREMOJIS[7].id,
		},
	},
];
