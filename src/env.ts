declare const env: {
    readonly AUTH_URL: string;
    readonly API_URL: string;
    readonly WS_URL: string;
};

export const {
    AUTH_URL = '',
    API_URL = '',
    WS_URL = ''
} = env;