using System.Collections.Generic;

namespace TelemView.API.Dtos
{
    public interface DataForHomeDto
    {
         public ICollection<StudentDto> Students { get; set; }
         public ICollection<CourseDto> Courses { get; set; }
         public ICollection<LecturersDto> Lecturers { get; set; }
         public ICollection<TagDto> Tags { get; set; }
         public ICollection<OrganizationDto> Organizations { get; set; }
         public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
         public ICollection<TaskDto> Tasks { get; set; }
         public ICollection<ProductTypeDto> ProductTypes { get; set; }
         public ICollection<YearDto> Years { get; set; }
         public ICollection<DegreeDto> Degree { get; set; }
         public ICollection<ProductForHomeDto> Product { get; set; }
    }
}