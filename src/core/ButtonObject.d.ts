import CommandBase from '../core/CommandBase';

export interface ButtonObject {
	[id: string]: ServerButtonObject;
}

interface ServerButtonObject {
	[id: string]: ChannelButtonObject;
}

interface ChannelButtonObject {
	[id: string]: CommandBase;
}
