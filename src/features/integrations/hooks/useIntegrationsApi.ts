import { useMemo } from 'react';

import { useApiContext } from '@olegpolyakov/frontend/services/api';

import IntegraionsApi from '../IntegrationsApi';

export default function useIntegraionsApi() {
    const { http } = useApiContext();

    return useMemo(() => new IntegraionsApi(http), [http]);
}