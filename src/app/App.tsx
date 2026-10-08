import { Route, Routes } from 'react-router-dom';

import { Heading, Screen, Scrollable, State } from '@olegpolyakov/ui';
import { AppContent, AppDrawer, AppShell } from '@olegpolyakov/frontend/app';
import { useAuthContext } from '@olegpolyakov/frontend/features/auth';

import { API_URL, WS_URL } from '@/env';
import { ChatProvider, Conversation, ConversationsList } from '@/features/chat';

import styles from './App.module.scss';

export default function App() {
    const { accessToken, userId } = useAuthContext();

    return (
        <AppShell name="AI">
            <ChatProvider
                accessToken={accessToken}
                userId={userId}
                apiUrl={API_URL}
                wsUrl={WS_URL}
            >
                <AppDrawer scrollable={false}>
                    <Scrollable className={styles.sidebar} fade>
                        <Heading content="AI" />
                            
                        <ConversationsList />
                    </Scrollable>
                </AppDrawer>
                
                <AppContent>
                    <Routes>
                        <Route
                            path="/:conversationId/:messageId?"
                            element={<Conversation />}
                        />

                        <Route
                            path="*"
                            element={
                                <Screen>
                                    <State title="Select or create a conversation"  />
                                </Screen>
                            }
                        />
                    </Routes>
                </AppContent>
            </ChatProvider>
        </AppShell>
    );
}