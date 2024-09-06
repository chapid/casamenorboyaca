//data/list-users-handler
import { env } from "$amplify/env/list-users"
import type { Schema } from '../resource';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler: Schema['listUsers']['functionHandler'] = async () => {
  const command = new ListUsersCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  });

  const response = await client.send(command);

  // Ensure the return type of the function matches the one defined in the query
  const Users: Schema['UsersResponse']['type'] = {
    users:
      response.Users?.map((user) => {
        return {
          Username: user.Username || '',
          UserStatus: user.UserStatus || '',
          UserCreateDate: user.UserCreateDate?.toISOString() || '',
          UserLastModifiedDate: user.UserLastModifiedDate?.toISOString() || '',
          Enabled: user.Enabled || false,
          Attributes:
            user.Attributes?.map((attribute) => {
              return {
                Name: attribute.Name || '',
                Value: attribute.Value || '',
              };
            }) || [],
        };
      }) || [],
  };

  return Users;
};