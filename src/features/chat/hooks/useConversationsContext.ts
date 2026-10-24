import { useContext } from 'react';

import ConversationsContext from '../ConversationsContext';

export default function useConversationsContext() {
    return useContext(ConversationsContext);
}