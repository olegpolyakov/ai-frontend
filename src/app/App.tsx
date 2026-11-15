import { Link, Route, Routes } from 'react-router-dom';

import { Button } from '@olegpolyakov/ui';
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
import { IntegrationsProvider } from '@/features/integrations';
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
                <UploadProvider uploadUrl={UPLOAD_URL}>
                    <ModelsProvider>
                        <IntegrationsProvider>
                            <ChatProvider userId={userId}>
                                <ConversationsProvider>
                                    <AppDrawer
                                        actions={<>
                                            <Button
                                                as={Link}
                                                icon="quickreply"
                                                to="/"
                                                title="New quick response"
                                            />
                                                
                                            <SettingsButton />
                                        </>}
                                    >
                                        <ConversationsList />
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
                        </IntegrationsProvider>
                    </ModelsProvider>
                </UploadProvider>
            </ApiProvider>
        </AppShell>
    );
}