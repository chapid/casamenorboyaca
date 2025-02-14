import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'casaMenorFiles',
  access: (allow) => ({
    'protected/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
      allow.groups(["EDITORS"]).to(["read", "write", "delete"]),
    ],    
  })
});