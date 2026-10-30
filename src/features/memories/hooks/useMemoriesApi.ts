import { useMemo } from 'react';

import { HttpClient } from '@olegpolyakov/frontend/clients/http';

import MemoriesApi from '../MemoriesApi';

export default function useMemoriesApi(apiUrl: string, accessToken: string) {
    return useMemo(() => new MemoriesApi(
        new HttpClient(apiUrl, { accessToken })
    ), [apiUrl, accessToken]);
}