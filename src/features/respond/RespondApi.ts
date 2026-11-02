import type { HttpClient } from '@olegpolyakov/frontend/clients/http';

import type { MessageData } from '@/features/messages';


export type ResponseData = {
    data: MessageData;
};

export default class RespondApi {
    constructor(
        private readonly http: HttpClient
    ) {}

    async getResponse(messages: MessageData[], files: File[], options: { model: string }): Promise<ResponseData> {
        const formData = new FormData();

        formData.append('input', JSON.stringify(messages));
        formData.append('model', options.model);
        files.forEach(file => {
            formData.append('files', file);
        });

        const res = await this.http.post<ResponseData>('/respond', formData);

        return res;
    }
}