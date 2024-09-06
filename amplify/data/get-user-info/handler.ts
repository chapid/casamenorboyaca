import type { Schema } from '../resource';
import {
  CognitoIdentityProviderClient,
  GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler: Schema['getUserInfo']['functionHandler'] = async (event) => {
  const command = new GetUserCommand({
    AccessToken: event.arguments.accessToken
  });

  const response = await client.send(command);

  // Ensure the return type of the function matches the one defined in the query
  // { // GetUserResponse
//   Username: "STRING_VALUE", // required
//   UserAttributes: [ // AttributeListType // required
//     { // AttributeType
//       Name: "STRING_VALUE", // required
//       Value: "STRING_VALUE",
//     },
//   ],
//   MFAOptions: [ // MFAOptionListType
//     { // MFAOptionType
//       DeliveryMedium: "SMS" || "EMAIL",
//       AttributeName: "STRING_VALUE",
//     },
//   ],
//   PreferredMfaSetting: "STRING_VALUE",
//   UserMFASettingList: [ // UserMFASettingListType
//     "STRING_VALUE",
//   ],
// };
  const User: Schema['UserInfoResponse']['type'] = {
    Username: response.Username || '',
    UserAttributes: response.UserAttributes?.map((attribute) => {
      return {
        Name: attribute.Name || '',
        Value: attribute.Value || ''
      };
    }) || [],
    MFAOptions: response.MFAOptions?.map((mfaOption) => {
      return {
        DeliveryMedium: mfaOption.DeliveryMedium || '',
        AttributeName: mfaOption.AttributeName || ''
      };
    }) || [],
    PreferredMfaSetting: response.PreferredMfaSetting || '',
    UserMFASettingList: response.UserMFASettingList || []
  };

  return User;
};