import { useMemo } from 'react';

import { useApiContext } from '@olegpolyakov/frontend/services/api';

import ModelsApi from '../ModelsApi';

export default function useModelsApi() {
    const { http } = useApiContext();

    return useMemo(() => new ModelsApi(http), [http]);
}