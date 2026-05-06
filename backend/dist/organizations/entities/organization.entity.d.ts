import { Site } from '../../sites/entities/site.entity';
export declare class Organization {
    id: string;
    name: string;
    sites: Site[];
    createdAt: Date;
}
