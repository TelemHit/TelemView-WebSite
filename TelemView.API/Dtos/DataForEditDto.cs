using System.Collections.Generic;

//dto for general data needed for Edit product page
namespace TelemView.API.Dtos
{
    public interface DataForEditDto
    {
         public ICollection<StudentDto> Students { get; set; }
         public ICollection<CourseDto> Courses { get; set; }
         public ICollection<LecturersDto> Lecturers { get; set; }
         public ICollection<TagDto> Tags { get; set; }
         public ICollection<OrganizationDto> Organizations { get; set; }
         public ICollection<OrganizationTypeDto> OrganizationTypes { get; set; }
         public ICollection<TaskDto> Tasks { get; set; }
         public ICollection<ProductTypeDto> ProductTypes { get; set; }
         public ICollection<DegreeDto> Degree { get; set; }
    }
}