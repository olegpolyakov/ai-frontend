import { useContext } from 'react';

import ConversationContext from '../ConversationContext';

export default function useConversationContext() {
    return useContext(ConversationContext);
}