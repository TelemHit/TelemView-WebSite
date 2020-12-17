using System;
using System.Collections.Generic;
using TelemView.API.Models;

namespace TelemView.API.Dtos
{
    public class ProductForHomeDto
    {
        public int Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Title { get; set; }
        public string Brief { get; set; }
        public int YearOfCreation { get; set; }
        public string Degree { get; set; }
        public bool isPublish { get; set; }
        public bool showOnHomePage { get; set; }
        public string ThumbnailUrl { get; set; }
        public string MainPhotoUrl {get; set;}
        public string TaskTitle {get; set; }
        public string ProductTypeTitle {get; set;}
        public string OrganizationTitle { get; set; }
        public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
        public ICollection<LecturersDto> Lecturers { get; set; }
        public ICollection<TagDto> Tags { get; set; }
        public ICollection<CourseDto> Courses { get; set; }
        public ICollection<StudentDto> Students { get; set; }
    }
}