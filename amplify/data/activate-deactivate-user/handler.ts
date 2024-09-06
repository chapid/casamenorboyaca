import { env } from "$amplify/env/list-users"
import type { Schema } from '../resource';
import {
    CognitoIdentityProviderClient,
    AdminEnableUserCommand,
    AdminDisableUserCommand,
    } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler: Schema['activateDeactivateUser']['functionHandler'] = async (event) => {
    if (event.arguments.enable) {
        const command = new AdminEnableUserCommand({
            UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
            Username: event.arguments.username
        });

        const response = await client.send(command);

        if (response.$metadata.httpStatusCode === 200) {
            const opInfo: Schema['UserStateChange']['type'] = {
                username: event.arguments.username,
                enabled: true
            };
            return opInfo;
        } else {
            throw new Error('Error activando usuario');
        }
    } else {
        const command = new AdminDisableUserCommand({
            UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
            Username: event.arguments.username
        });

        const response = await client.send(command);

        if (response.$metadata.httpStatusCode === 200) {
            const opInfo: Schema['UserStateChange']['type'] = {
                username: event.arguments.username,
                enabled: false
            };
            return opInfo;
        } else {
            throw new Error('Error desactivando usuario');
        }
    }
};