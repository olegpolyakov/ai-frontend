import type { MessageData } from '@/features/messages';

export type ResponseData = {
    data: MessageData;
};

export interface RespondApi {
    getResponse(messages: MessageData[], files: File[], options: { model: string }): Promise<ResponseData>;
}
