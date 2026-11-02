import { Link, Route, Routes } from 'react-router-dom';

import { Button, ButtonGroup, Flex, Heading, Scrollable } from '@olegpolyakov/ui';
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
import { ModelsProvider } from '@/features/models';
import { Respond } from '@/features/respond';
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
                <ModelsProvider>
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

                                            <ButtonGroup>
                                                <Button
                                                    as={Link}
                                                    icon="quickreply"
                                                    to="/"
                                                    title="New quick response"
                                                />
                                                
                                                <SettingsButton />
                                            </ButtonGroup>
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
                                                <Respond />
                                            }
                                        />
                                    </Routes>
                                </AppContent>
                            </ConversationsProvider>
                        </ChatProvider>
                    </UploadProvider>
                </ModelsProvider>
            </ApiProvider>
        </AppShell>
    );
}