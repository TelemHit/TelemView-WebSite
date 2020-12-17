import { Media } from './media';
import { Lecturer } from './lecturer';
import { Student } from './Student';
import { Tag } from './Tag';
import { Course } from './Course';

export interface ProductForCreate {
        title: string;
        taskId: number;
        productTypeId: number;
        organizationId: number;
}
