
using System.Collections.Generic;
//dto for general data needed for Home page - filters
namespace TelemView.API.Dtos
{
    public interface DataForHomeDto
    {
         public ICollection<CourseDto> Courses { get; set; }
         public ICollection<LecturersDto> Lecturers { get; set; }
         public ICollection<OrganizationDto> Organizations { get; set; }
         public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
         public ICollection<TaskDto> Tasks { get; set; }
         public ICollection<ProductTypeDto> ProductTypes { get; set; }
         public ICollection<YearDto> Years { get; set; }
         public ICollection<DegreeDto> Degree { get; set; }
    }
}