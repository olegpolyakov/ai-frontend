import { useContext } from 'react';

import IntegrationsContext from '../IntegrationsContext';

export default function useIntegrationsContext() {
    return useContext(IntegrationsContext);
}