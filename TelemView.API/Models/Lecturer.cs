using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class Lecturer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ProductLecturer> ProductsLecturers { get; set; }
    }
}