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
		label: '1',
	},
	{
		id: '1',
		label: '2',
	},
	{
		id: '2',
		label: '3',
	},
	{
		id: '3',
		label: '4',
	},
];

export const buttonsRowTwo: Button[] = [
	{
		id: '4',
		label: '5',
	},
	{
		id: '5',
		label: '6',
	},
	{
		id: '6',
		label: '7',
	},
	{
		id: '7',
		label: '8',
	},
];
