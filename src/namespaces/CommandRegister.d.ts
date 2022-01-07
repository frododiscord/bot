export interface CommandRegisterData {
    name?: string;
    description?: string;
    options?: CommandOption[];
}

interface CommandOption {
    name: string;
    description: string;
    choices?: CommandChoice[];
    required?: boolean;
    type: 'STRING' | 'BOOLEAN' | 'USER';
}

interface CommandChoice {
    name: string;
    description: string;
}
