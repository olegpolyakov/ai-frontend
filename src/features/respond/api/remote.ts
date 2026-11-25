import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { RespondApi, ResponseData } from './interface';

export default (http: HttpClient): RespondApi => ({
    async getResponse(messages, files, options) {
        const formData = new FormData();

        formData.append('input', JSON.stringify(messages));
        formData.append('model', options.model);
        files.forEach(file => {
            formData.append('files', file);
        });

        return http.post<ResponseData>('/respond', formData);
    }
});
