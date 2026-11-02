import { useMemo } from 'react';

import { useApiContext } from '@olegpolyakov/frontend/services/api';

import RespondApi from '../RespondApi';

export default function useRespondApi() {
    const { http } = useApiContext();

    return useMemo(() => new RespondApi(http), [http]);
}