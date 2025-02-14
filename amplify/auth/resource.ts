import { defineAuth } from '@aws-amplify/backend';
import { addUserToGroup } from "../data/add-user-to-group/resource"
import { postConfirmation } from "./post-confirmation/resource"
import { listUsersHandler } from '../data/list-users-handler/resource';
import { activateDeactivateUser } from '../data/activate-deactivate-user/resource';
import { getUserInfo } from '../data/get-user-info/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: 'Bienvenido! Verifica tu email!',
      verificationEmailBody: (createCode) => `Use este codigo para confirmar su cuenta: ${createCode()}`,
    },    
  },
    
  groups: ["ADMINS", "EDITORS"],
  triggers: {
    postConfirmation,
  },
  
  access: (allow) => [
    allow.resource(addUserToGroup).to(["addUserToGroup"]),
    allow.resource(postConfirmation).to(["addUserToGroup"]),    
    allow.resource(listUsersHandler).to(["listUsers"]),
    allow.resource(activateDeactivateUser).to(["manageUsers"]),
    allow.resource(getUserInfo).to(["manageUsers"]),
  ],
});
