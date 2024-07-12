import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'casaMenorFiles',
  access: (allow) => ({
    'protected/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read'])
    ],    
  })
});