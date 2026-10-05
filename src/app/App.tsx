import { useAuthContext } from '@olegpolyakov/frontend/features/auth';

import { API_URL, WS_URL } from '@/env';
import { Chat } from '@/features/chat';

export default function App() {
    const { accessToken, userId } = useAuthContext();

    return (
        <Chat
            accessToken={accessToken}
            userId={userId}
            apiUrl={API_URL}
            wsUrl={WS_URL}
        />
    );
}