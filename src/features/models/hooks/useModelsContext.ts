import { useContext } from 'react';

import ModelsContext from '../ModelsContext';

export default function useModelsContext() {
    return useContext(ModelsContext);
}