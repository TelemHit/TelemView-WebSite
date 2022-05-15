using System;
using System.Collections.Generic;
using TelemView.API.Models;

//returns product data needed for home page
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
        public bool ShowOnHomePage { get; set; }
        public string MainPhotoUrl {get; set;}
        public string TaskTitle {get; set; }
        public int TaskId { get; set; }
        public string ProductTypeTitle {get; set;}
        public int ProductTypeId { get; set; }
        public string OrganizationTitle { get; set; }
        public int OrganizationId { get; set; }
        public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
        public ICollection<LecturersDto> Lecturers { get; set; }
        public ICollection<CourseDto> Courses { get; set; }
    }
}