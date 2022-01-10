#!/bin/bash

read -p "Command Name: " name
read -p "Command Description: " description
read -p "Category: " category
read -p "Function or class: " f_or_c
read -p "Command options (y/n): " options

name=${name,,}

if [ "$options" = "y" ]
then
OPTIONS=$(cat << EOF
options: [
    {
        name: 'NAME',
        description: 'DESCRIPTION',
        type: 'TYPE',
        required: 'true',
    },
],
EOF
)
fi

DATA=$(cat << EOF
{
    name: '$name',
    description: '$description',
    version: '1.0.0',
    handler: $name,
    $OPTIONS
}
EOF
)

COMMAND=$(cat << EOF
import {Command} from './../../../namespaces/Command.d';
import $name from './$name.js';

export const command: Command = $DATA;
EOF
)

COMMAND_CLASS=$(cat << EOF
import {CommandBaseOptions} from '../../../namespaces/CommandBaseOptions.js';
import CommandBase from '../../../utils/CommandBase.js';

export default class ${name^} extends CommandBase {
	constructor(options: CommandBaseOptions) {
		super(options);
	}
}
EOF
)

COMMAND_FUNCTION=$(cat << EOF
import {FrodoClient, Message, Options, Interaction} from '../../../FrodoClient';

export default function(this: FrodoClient, message: Message, options: Options, interaction: Interaction) {

}
EOF
)

if [ ! -d "../src/commands/$category" ]
then
    mkdir "../src/commands/$category"
fi

if [ -d "../src/commands/$category/$name" ]
then
    echo "Command already exists"
    exit
fi

mkdir "../src/commands/$category/$name"
touch "../src/commands/$category/$name/$name.ts"
touch "../src/commands/$category/$name/command.ts"

echo "$COMMAND" >> "../src/commands/$category/$name/command.ts"

if [ "$f_or_c" = "class" ]
then
    echo "$COMMAND_CLASS" >> "../src/commands/$category/$name/$name.ts"
elif [ "$f_or_c" = "function" ]
then
    echo "$COMMAND_FUNCTION" >> "../src/commands/$category/$name/$name.ts"
else
    echo "Invalid command type"
    exit
fi