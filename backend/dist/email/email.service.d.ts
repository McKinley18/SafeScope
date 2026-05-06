export declare class EmailService {
    sendWorkspaceInvite(data: {
        to: string;
        companyName: string;
        inviteLink: string;
        role: string;
    }): Promise<{
        ok: boolean;
        devMode: boolean;
        message?: undefined;
    } | {
        ok: boolean;
        message: string;
        devMode?: undefined;
    }>;
}
