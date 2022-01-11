import {Button} from '../../../core/Button';

export const region = 'en';

export const buttons: Button[] = [
	{
		label: 'Yes',
		id: '0',
		style: 'SUCCESS',
	},
	{
		label: 'No',
		id: '1',
		style: 'DANGER',
	},
	{
		label: 'Don\'t know',
		id: '2',
	},
	{
		label: 'Probably',
		id: '3',
	},
	{
		label: 'Probably Not',
		id: '4',
	},
];
export const backButton: Button = {
	label: 'Back',
	id: '5',
	style: 'SECONDARY',
};
export const winButtons: Button[] = [
	{
		label: 'Yes',
		id: '11',
		style: 'SUCCESS',
	},
	{
		label: 'No',
		id: '12',
		style: 'DANGER',
	},
];
