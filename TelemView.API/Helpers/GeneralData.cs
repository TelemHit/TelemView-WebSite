using System.Collections.Generic;
using TelemView.API.Models;

namespace TelemView.API.Helpers
{
    //helper class for general data
    public class GeneralData
    {
        public ICollection<Lecturer> Lecturers { get; set; }
        public ICollection<Course> Courses { get; set; }
        public ICollection<Organization> Organizations { get; set; }
        public ICollection<OrganizationType> OrganizationTypes { get; set; }
        public ICollection<Student> Students { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Task> Tasks { get; set; }
        public ICollection<ProductType> ProductTypes { get; set; }
        public ICollection<Year> Years { get; set; }
        public ICollection<Degree> Degree { get; set; }
    }
}