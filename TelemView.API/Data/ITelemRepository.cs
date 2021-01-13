using System.Collections.Generic;
using System.Threading.Tasks;
using TelemView.API.Helpers;
using TelemView.API.Models;

namespace TelemView.API.Data
{
    public interface ITelemRepository
    {
        Task<PagedList<Product>> GetProducts(ProductParams productParams);
        Task<Product> GetProduct(int id);
        Task<bool> ProductExists(int id);
        Task<DataForHome> GetDataForHome();
        Task<bool> SaveAll();
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<Media> GetMedia(int id);
        Task<ProductType> GetType(int id);
        Task<IEnumerable<ProductType>> GetTypes();
        Task<Student> GetStudent(int id);
        Task<IEnumerable<Student>> GetStudents();
        Task<Lecturer> GetLecturer(int id);
        Task<IEnumerable<Lecturer>> GetLecturers();
        Task<Tag> GetTag(int id);
        Task<IEnumerable<Tag>> GetTags();
        Task<Course> GetCourse(int id);
        Task<IEnumerable<Course>> GetCourses();
        Task<Product> CreateProduct(Product product);
        Task<Models.Task> GetTask(int id);
        Task<IEnumerable<Models.Task>> GetTasks();
        Task<Organization> GetOrganization(int id);
        Task<IEnumerable<Organization>> GetOrganizations();
        Task<OrganizationType> GetOrganizationType(int id);
        Task<IEnumerable<OrganizationType>> GetOrganizationTypes();
        Task<IEnumerable<object>> GetUsers();
    }
}