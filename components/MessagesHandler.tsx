import { Message, Flex, IconsProvider } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import {
    FcMediumPriority,
    FcHighPriority,
    FcInfo,
    FcOk,
} from 'react-icons/fc';

function MessagesHandler({ messageType, messageContent }: { messageType: string, messageContent: string }) {
    const [messageTypeInner, setMessageTypeInner] = useState('');
    const [messageContentInner, setMessageContentInner] = useState('');

    useEffect(() => {
        setMessageContentInner(messageContent);
        setMessageTypeInner(messageType);
    }, [messageType, messageContent]);

    return (
        <IconsProvider
            icons={{
                message: {
                    info: <FcInfo />,
                    success: <FcOk />,
                    error: <FcHighPriority />,
                    warning: <FcMediumPriority />,                
                },
            }}
        >
            <Flex direction="column" id="messageHolder">
                {messageTypeInner === 'success' && (  
                    <Message role="alert" heading="Operación exitosa" colorTheme="success" isDismissible>
                        {messageContentInner}
                    </Message>
                )}
                {messageTypeInner === 'error' && (  
                    <Message role="alert" heading="Error" colorTheme="error" isDismissible>
                        {messageContentInner}
                    </Message>
                )}
                {messageTypeInner === 'warning' && (  
                    <Message role="alert" heading="Advertencia" colorTheme="warning" isDismissible>
                        {messageContentInner}
                    </Message>
                )}
                {messageTypeInner === 'info' && (  
                    <Message role="alert" heading="Información" colorTheme="info" isDismissible>
                        {messageContentInner}
                    </Message>
                )}                
            </Flex>                                               
        </IconsProvider>
    );
};

export default MessagesHandler;