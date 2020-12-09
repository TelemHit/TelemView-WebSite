using System;
using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Title { get; set; }
        public string Brief { get; set; }
        public string Description { get; set; }
        public int YearOfCreation { get; set; }
        public string ProductUrl { get; set; }
        public string Degree { get; set; }
        public bool IsApproved { get; set; }
        public bool IsPublish { get; set; } 
        public bool ShowOnHomePage { get; set; }
        public string ThumbnailUrl { get; set; }
        public Task Task {get; set;}
        public int TaskId {get; set;}
        public ProductType ProductType {get; set;}
        public int ProductTypeId {get; set;}
        public Organization Organization { get; set; }
        public int OrganizationId { get; set; }
        public ICollection<Media> Media { get; set; }
        public ICollection<ProductStudent> ProductStudents { get; set; }
        public ICollection<ProductTag> ProductsTags { get; set; }
        public ICollection<ProductLecturer> ProductsLecturers { get; set; }
        public ICollection<ProductCourse> ProductsCourses { get; set; }
    }
}