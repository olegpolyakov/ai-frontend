import { useMemo } from 'react';

import { useApiContext } from '@olegpolyakov/frontend/services/api';

import ChatApi from '../ChatApi';

export default function useChatApi() {
    const { http } = useApiContext();

    return useMemo(() => new ChatApi(http), [http]);
}