using System.Collections.Generic;
using System.Threading.Tasks;
using TelemView.API.Helpers;
using TelemView.API.Models;

namespace TelemView.API.Data
{
    public interface ITelemRepository
    {
        Task<IEnumerable<Product>> GetProducts(ProductParams productParams);
        Task<Product> GetProduct(int id);
        Task<DataForHome> GetDataForHome();
        Task<bool> SaveAll();
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<Media> GetMedia(int id);
        Task<Student> AddStudent(Student student);
        Task<bool> StudentExists(string name);
        Task<Lecturer> AddLecturer(Lecturer lecturer);
        Task<bool> LecturerExists(string name);
        Task<Tag> AddTag(Tag tag);
        Task<bool> TagExists(string title);
        Task<Course> AddCourse(Course course);
        Task<bool> CourseExists(string title);
        Task<Organization> AddOrganization(Organization organization, IEnumerable<int> organizationTypes);
        Task<bool> OrganizationExists(string title);
    }
}