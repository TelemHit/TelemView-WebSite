using System.Linq;
using AutoMapper;
using TelemView.API.Dtos;
using TelemView.API.Models;
//we use AutoMapper library to map between objects.
//mainly between models and dto
//this file define all those maps. 
namespace TelemView.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForLoginDto>();
            CreateMap<User, UserForRegisterDto>();
            CreateMap<UserForRegisterDto, User>()
            .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
            CreateMap<Product, ProductForHomeDto>()
            .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(
                src => src.Media.FirstOrDefault(m => m.IsMain).Url
            ))
            .ForMember(dest => dest.Lecturers, opt => opt.MapFrom(
                src => src.ProductsLecturers
            ))
            .ForMember(dest => dest.Courses, opt => opt.MapFrom(
                src => src.ProductsCourses
            ))
            .ForMember(dest => dest.OrganizationTypes, opt => opt.MapFrom(
                src => src.Organization.OrganizationAndType
            ));
            CreateMap<Lecturer, LecturersDto>()
            .ForMember(dest => dest.Counter, opt =>
                opt.MapFrom(src => src.ProductsLecturers.Count));
            CreateMap<ProductLecturer, LecturersDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(
                src => src.LecturerId
            ))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(
                src => src.Lecturer.Name
            ));
            CreateMap<Tag, TagDto>()
            .ForMember(dest => dest.Counter, opt =>
                opt.MapFrom(src => src.ProductsTags.Count));
            CreateMap<ProductTag, TagDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(
                src => src.TagId
            ))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(
                src => src.Tag.Title
            ));
            CreateMap<Course, CourseDto>()
            .ForMember(dest => dest.Counter, opt =>
                opt.MapFrom(src => src.ProductsCourses.Count));
            CreateMap<ProductCourse, CourseDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(
                src => src.CourseId
            ))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(
                src => src.Course.Title
            ));
            CreateMap<Student, StudentDto>()
            .ForMember(dest => dest.Counter, opt =>
                opt.MapFrom(src => src.ProductStudents.Count));
            CreateMap<ProductStudent, StudentDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(
                src => src.StudentId
            ))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(
                src => src.Student.Name
            ));
            CreateMap<OrganizationsAndTypes, OrganizationDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(
                src => src.OrganizationId
            ))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(
                src => src.Organization.Title
            ));
            CreateMap<OrganizationsAndTypes, OrganizationTypeDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(
                src => src.OrganizationTypeId
            ))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(
                src => src.OrganizationType.Title
            ));

            CreateMap<GeneralData, DataForHomeDto>();
            CreateMap<GeneralData, DataForEditDto>();
            CreateMap<Year, YearDto>();
            CreateMap<Degree, DegreeDto>();
            CreateMap<Organization, OrganizationDto>()
            .ForMember(dest => dest.Counter, opt =>
                    opt.MapFrom(src => src.Products.Count))
            .ForMember(dest => dest.OrganizationTypes, opt => opt.MapFrom(
                src => src.OrganizationAndType
            ));
            CreateMap<OrganizationType, OrganizationTypeDto>().ForMember(dest => dest.Counter, opt =>
                    opt.MapFrom(src => src.OrganizationAndType.CalculateCounter()));
            CreateMap<Task, TaskDto>().ForMember(dest => dest.Counter, opt =>
                    opt.MapFrom(src => src.Products.Count));
            CreateMap<ProductType, ProductTypeDto>().ForMember(dest => dest.Counter, opt =>
                    opt.MapFrom(src => src.Products.Count));
            CreateMap<Product, ProductDetailsDto>()
            .ForMember(dest => dest.Lecturers, opt => opt.MapFrom(
                src => src.ProductsLecturers
            ))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(
                src => src.ProductsTags
            ))
            .ForMember(dest => dest.Students, opt => opt.MapFrom(
                src => src.ProductStudents
            ))
            .ForMember(dest => dest.Courses, opt => opt.MapFrom(
                src => src.ProductsCourses
            ))
            .ForMember(dest => dest.OrganizationTypes, opt => opt.MapFrom(
                src => src.Organization.OrganizationAndType
            ));
            CreateMap<Media, MediaDto>()
            .ForMember(dest => dest.MDescription, opt => opt.MapFrom(
                src => src.Description
            ));

            CreateMap<ProductUpdateDto, Product>()
            .ForMember(dest => dest.ProductsTags, opt => opt.MapFrom(
                src => src.Tags
            ))
            .ForMember(dest => dest.ProductStudents, opt => opt.MapFrom(
                src => src.Students
            ))
            .ForMember(dest => dest.ProductsLecturers, opt => opt.MapFrom(
                src => src.Lecturers
            ))
            .ForMember(dest => dest.ProductsCourses, opt => opt.MapFrom(
                src => src.Courses
            ));
            CreateMap<TagDto, ProductTag>()
            .ForMember(dest => dest.TagId, opt => opt.MapFrom(
                src => src.Id
            ));
            CreateMap<StudentDto, ProductStudent>()
            .ForMember(dest => dest.StudentId, opt => opt.MapFrom(
                src => src.Id
            ));

            CreateMap<CourseDto, ProductCourse>()
           .ForMember(dest => dest.CourseId, opt => opt.MapFrom(
               src => src.Id
           ));
            CreateMap<LecturersDto, ProductLecturer>()
           .ForMember(dest => dest.LecturerId, opt => opt.MapFrom(
               src => src.Id
           ));
            CreateMap<MediaForCreationDto, Media>();
            CreateMap<Media, MediaForReturnDto>()
            .ForMember(dest => dest.MDescription, opt => opt.MapFrom(
                src => src.Description
            ));
            CreateMap<MediaDto, Media>()
            .ForMember(dest => dest.Description, opt => opt.MapFrom(
                src => src.MDescription
            ));

            CreateMap<LinkForCreationDto, Media>()
            .ForMember(dest => dest.Description, opt => opt.MapFrom(
                src => src.MDescription
            ));
            CreateMap<Product, ProductIdDto>();
            CreateMap<ProductTypeDto, ProductType>();
            CreateMap<TagDto, Tag>();
            CreateMap<StudentDto, Student>();
            CreateMap<LecturersDto, Lecturer>();
            CreateMap<CourseDto, Course>();
            CreateMap<TaskDto, Task>();
            CreateMap<OrganizationDto, Organization>()
            .ForMember(dest => dest.OrganizationAndType, opt => opt.MapFrom(
                src => src.OrganizationTypes
            ));
            CreateMap<OrganizationDto, OrganizationsAndTypes>()
            .ForMember(dest => dest.OrganizationId, opt => opt.MapFrom(
                            src => src.Id
            ));
            CreateMap<OrganizationTypeDto, OrganizationType>();
            CreateMap<OrganizationTypeDto, OrganizationsAndTypes>()
            .ForMember(dest => dest.OrganizationTypeId, opt => opt.MapFrom(
                src => src.Id
            ));
        }
    }
}