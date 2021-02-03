import { Media } from './media';
import { Lecturer } from './lecturer';
import { Student } from './Student';
import { Tag } from './Tag';
import { Course } from './Course';

//model of initial data sends to save product
export interface ProductForCreate {
        title: string;
        taskId: number;
        productTypeId: number;
        organizationId: number;
}
