import {MunicipioCreateForm} from "@/ui-components";
import { withAuthenticator } from '@aws-amplify/ui-react';


function Page() {
    
    return (
        <div>
            <h1>Gestor de contenido</h1>
            <MunicipioCreateForm  />
        </div>
    );
}

export default withAuthenticator(Page);