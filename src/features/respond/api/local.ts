import { NIL, v4 as uuid } from '@olegpolyakov/core/utils/uuid';

import type { RespondApi } from './interface';

const REPLY_DELAY = 800;
const REPLY_CONTENT = 'This is a demo response. Sign in to get responses from real AI models.';

export default (): RespondApi => ({
    async getResponse() {
        await new Promise(resolve => setTimeout(resolve, REPLY_DELAY));

        const now = new Date().toISOString();

        return {
            data: {
                id: uuid(),
                conversationId: NIL,
                content: REPLY_CONTENT,
                role: 'assistant',
                refs: [],
                createdAt: now,
                updatedAt: now
            }
        };
    }
});
