export interface Button {
	id: string;
	label?: string;
	style?: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	disabled?: boolean;
	emoji?: string;
}
