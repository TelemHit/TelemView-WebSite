using System.Collections.Generic;

namespace TelemView.API.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<ProductStudent> ProductStudents { get; set; }
    }
}