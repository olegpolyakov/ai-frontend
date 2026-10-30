import { Route, Routes } from 'react-router-dom';

import { Flex, Heading, Icon, Screen, Scrollable, State } from '@olegpolyakov/ui';
import { AppContent, AppDrawer, AppShell } from '@olegpolyakov/frontend/app';
import { useAuthContext } from '@olegpolyakov/frontend/features/auth';
import { UploadProvider } from '@olegpolyakov/frontend/features/upload';
import { ApiProvider } from '@olegpolyakov/frontend/services/api';

import { API_URL, UPLOAD_URL, WS_URL } from '@/env';
import {
    ChatProvider,
    Conversation,
    ConversationProvider,
    ConversationsList,
    ConversationsProvider
} from '@/features/chat';
import { SettingsButton } from '@/features/settings';

import styles from './App.module.scss';

export default function App() {
    const { userId } = useAuthContext();

    return (
        <AppShell name="AI">
            <ApiProvider
                apiUrl={API_URL}
                wsUrl={WS_URL}
            >
                <UploadProvider uploadUrl={UPLOAD_URL}>
                    <ChatProvider userId={userId}>
                        <ConversationsProvider>
                            <AppDrawer scrollable={false}>
                                <Scrollable
                                    className={styles.sidebar}
                                    fade
                                >
                                    <Flex
                                        align="center"
                                        justify="between"
                                    >
                                        <Heading
                                            content="AI"
                                        />

                                        <SettingsButton />
                                    </Flex>
                            
                            
                                    <ConversationsList />
                                </Scrollable>
                            </AppDrawer>
                
                            <AppContent>
                                <Routes>
                                    <Route
                                        path="/:conversationId/:messageId?"
                                        element={
                                            <ConversationProvider>
                                                <Conversation />
                                            </ConversationProvider>
                                        }
                                    />

                                    <Route
                                        path="*"
                                        element={
                                            <Screen>
                                                <State
                                                    image={
                                                        <Icon
                                                            name="chat"
                                                            size="xl"
                                                        />
                                                    }
                                                    description="Select or create a conversation"
                                                />
                                            </Screen>
                                        }
                                    />
                                </Routes>
                            </AppContent>
                        </ConversationsProvider>
                    </ChatProvider>
                </UploadProvider>
            </ApiProvider>
        </AppShell>
    );
}