export type IntegrationType = 'mcp';

export type Integration = {
    id: string;
    userId: string;
    type: IntegrationType;
    name: string;
    url: string;
    enabled: boolean;
    credentials: Record<string, string>;
};