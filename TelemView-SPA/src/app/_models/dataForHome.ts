import { Lecturer } from './lecturer';
import { Student } from './Student';
import { Tag } from './Tag';
import { Course } from './Course';
import { Organization } from './organization';
import { OrganizationType } from './organizationType';
import { Task } from './task';
import { ProductType } from './productType';
import { Year } from './year';
import { Degree } from './Degree';

//general data for home page filters

export interface DataForHome {
    courses: Course[];
    lecturers: Lecturer[];
    organizations: Organization[];
    organizationTypes: OrganizationType[];
    tasks: Task[];
    productTypes: ProductType[];
    years: Year[];
    degree: Degree[];
}
