using System.Linq;
using AutoMapper;
using TelemView.API.Dtos;
using TelemView.API.Models;

namespace TelemView.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForLoginDto>();
            CreateMap<User, UserForRegisterDto>();
            CreateMap<Product, ProductForHomeDto>()
            .ForMember(dest => dest.MainPhotoUrl, opt => opt.MapFrom(
                src => src.Media.FirstOrDefault(m => m.IsMain).Url
            ))
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
            .ForMember(dest => dest.OrganizationTypeTitle, opt => opt.MapFrom(
                src => src.Organization.OrganizationType.Title));
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

            CreateMap<DataForHome, DataForHomeDto>();
            CreateMap<Year, YearDto>();
            CreateMap<Degree, DegreeDto>();
            CreateMap<Organization, OrganizationDto>().ForMember(dest => dest.Counter, opt => 
                    opt.MapFrom(src => src.Products.Count));
            CreateMap<OrganizationType, OrganizationTypeDto>().ForMember(dest => dest.Counter, opt => 
                    opt.MapFrom(src => src.Organizations.CalculateCounter()));;
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
            .ForMember(dest => dest.OrganizationTypeTitle, opt => opt.MapFrom(
                src => src.Organization.OrganizationType.Title));
            CreateMap<Media, MediaDto>();
        }
    }
}