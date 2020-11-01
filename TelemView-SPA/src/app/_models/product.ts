import { Media } from './media';
import { Lecturer } from './lecturer';
import { Student } from './Student';
import { Tag } from './Tag';
import { Course } from './Course';

export interface Product {
        id: number;
        timeStamp: Date;
        title: string;
        brief: string;
        yearOfCreation: number;
        degree: string;
        showOnHomePage: boolean;
        thumbnailUrl: string;
        mainPhotoUrl: string;
        taskTitle: string;
        productTypeTitle: string;
        organizationTitle: string;
        organizationTypeTitle: string;
        leacturers: Lecturer[];
        students: Student[];
        courses: Course[];
        tags?: Tag[];
        media?: Media[];
}
