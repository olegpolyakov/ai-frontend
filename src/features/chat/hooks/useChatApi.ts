import { useMemo } from 'react';

import { HttpClient } from '@olegpolyakov/frontend/clients/http';

import ChatApi from '../ChatApi';

export default function useChatApi(apiUrl: string, accessToken: string) {
    return useMemo(() => new ChatApi(
        new HttpClient(apiUrl, { accessToken })
    ), [apiUrl, accessToken]);
}