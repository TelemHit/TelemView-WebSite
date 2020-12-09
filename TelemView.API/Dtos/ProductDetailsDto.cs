using System;
using System.Collections.Generic;
using TelemView.API.Models;

namespace TelemView.API.Dtos
{
    public class ProductDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int YearOfCreation { get; set; }
        public string ProductUrl { get; set; }
        public string Brief { get; set; }
        public string Degree { get; set; }
        public string TaskTitle {get; set; }
        public int TaskId {get; set; }
        public string ProductTypeTitle {get; set;}
        public int ProductTypeId {get; set;}
        public string OrganizationTitle { get; set; }
        public int OrganizationId { get; set; }
        public string Description { get; set; }
        public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
        public ICollection<LecturersDto> Lecturers { get; set; }
        public ICollection<TagDto> Tags { get; set; }
        public ICollection<CourseDto> Courses { get; set; }
        public ICollection<StudentDto> Students { get; set; }
         public ICollection<MediaDto> Media { get; set; }
    }
}