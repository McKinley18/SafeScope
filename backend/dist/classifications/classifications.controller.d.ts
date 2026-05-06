import { ClassificationsService } from './classifications.service';
export declare class ClassificationsController {
    private readonly classificationsService;
    constructor(classificationsService: ClassificationsService);
    review(classificationId: string, body: {
        action: any;
        notes: string;
    }): Promise<import("./entities/classification.entity").Classification>;
}
