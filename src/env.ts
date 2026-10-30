declare const env: {
    readonly AUTH_URL: string;
    readonly UPLOAD_URL: string;
    readonly FILES_API_URL: string;
    readonly API_URL: string;
    readonly WS_URL: string;
};

export const {
    AUTH_URL = '',
    UPLOAD_URL = '',
    FILES_API_URL = '',
    API_URL = '',
    WS_URL = ''
} = env;