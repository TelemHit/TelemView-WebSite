import { Media } from './media';
import { Lecturer } from './lecturer';
import { Student } from './Student';
import { Tag } from './Tag';
import { Course } from './Course';

export interface Product {
        id: number;
        timeStamp: Date;
        description: string;
        title: string;
        brief: string;
        yearOfCreation: number;
        heYearOfCreation: string;
        degree: string;
        showOnHomePage: boolean;
        taskTitle: string;
        taskDescription: string;
        isPublish: boolean;
        taskId: number;
        productTypeTitle: string;
        productTypeId: number;
        organizationTitle: string;
        organizationId: number;
        productUrl: string;
        organizationTypeTitle: string;
        mainPhotoUrl: string;
        lecturers: Lecturer[];
        students: Student[];
        courses: Course[];
        tags?: Tag[];
        media?: Media[];
        newMedia?: Media[];
}
