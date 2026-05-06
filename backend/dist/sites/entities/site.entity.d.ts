import { Organization } from '../../organizations/entities/organization.entity';
export declare class Site {
    id: string;
    name: string;
    organization: Organization;
    createdAt: Date;
}
