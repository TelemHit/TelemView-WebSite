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

//general data for edit form

export interface DataForEdit {
    courses: Course[];
    tags: Tag[];
    lecturers: Lecturer[];
    students: Student[];
    organizations: Organization[];
    organizationTypes: OrganizationType[];
    tasks: Task[];
    productTypes: ProductType[];
    degree: Degree[];
}
