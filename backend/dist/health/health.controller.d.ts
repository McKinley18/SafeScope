import { HealthService } from './health.service';
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    check(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
}
