import { useEffect } from 'react';

import { ChatEvent } from '../ChatClient';

import useChatContext from './useChatContext';

export default function useChatEvent<T = unknown>(event: ChatEvent, handler: (payload: T extends object ? T : undefined) => void) {
    const { client } = useChatContext();

    useEffect(() => {
        function callback(payload: T extends object ? T : undefined) {
            handler(payload);
        }

        client.on(event, callback);

        return () => {
            client.off(event, callback);
        };
    }, [client, event, handler]);
}