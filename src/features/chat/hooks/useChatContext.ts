import { useContext } from 'react';

import ChatContext from '../ChatContext';

export default function useChatContext() {
    return useContext(ChatContext);
}