using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Number { get; set; }
        public virtual ICollection<ProductCourse> ProductsCourses { get; set; }
    }
}