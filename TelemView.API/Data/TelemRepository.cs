using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelemView.API.Helpers;
using TelemView.API.Models;

namespace TelemView.API.Data
{
    public class TelemRepository : ITelemRepository
    {
        private readonly DataContext _context;
        public TelemRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedList<Product>> GetProducts(ProductParams productParams)
        {
            var products = _context.Products
            .OrderByDescending(p => p.TimeStamp).AsQueryable();

            if (productParams.HideUnpublished == true)
            {
                products = products.Where(p => p.IsPublish == true);
            }
            if (productParams.ProductTypes != null)
            {
                products = products.Where(p => productParams.ProductTypes.Contains(p.ProductType.Id));
            }
            if (productParams.Organizations != null)
            {
                products = products.Where(p => productParams.Organizations.Contains(p.Organization.Id));
            }
            if (productParams.Courses != null)
            {
                products = products.Where(p => p.ProductsCourses.Any(pc => productParams.Courses.Contains(pc.CourseId)));
            }
            if (productParams.Lecturers != null)
            {
                products = products.Where(p => p.ProductsLecturers.Any(pl => productParams.Lecturers.Contains(pl.LecturerId)));
            }
            if (productParams.OrganizationTypes != null)
            {
                products = products.Where(p => p.Organization.OrganizationAndType.Any(ot => productParams.OrganizationTypes.Contains(ot.OrganizationTypeId)));
            }
            if (productParams.Tasks != null)
            {
                products = products.Where(p => productParams.Tasks.Contains(p.Task.Id));
            }
            if (productParams.Years != null)
            {
                products = products.Where(p => productParams.Years.Contains(p.YearOfCreation));
            }
            if (productParams.Degree != null)
            {
                products = products.Where(p => productParams.Degree == p.Degree);
            }
            if (productParams.Search != null)
            {
                products = products.Where(p => p.Title.ToLower().Trim().Contains(productParams.Search.ToLower().Trim()));
            }

            return await PagedList<Product>.CreateAsync(products, productParams.PageNumber, productParams.PageSize);
        }


        public async Task<Product> GetProduct(int id)
        {
            var product = await _context.Products
            .FirstOrDefaultAsync(u => u.Id == id);
            return product;
        }

        public async Task<DataForHome> GetDataForHome()
        {
            var dataForHome = new DataForHome();
            dataForHome.Organizations = await _context.Organizations.ToListAsync();
            dataForHome.OrganizationTypes = await _context.OrganizationTypes.OrderBy(o => o.Title).ToListAsync();
            dataForHome.Students = await _context.Students.OrderBy(o => o.Name).ToListAsync();
            dataForHome.Tags = await _context.Tags.OrderBy(o => o.Title).ToListAsync();
            dataForHome.Tasks = await _context.Tasks.OrderBy(o => o.Title).ToListAsync();
            dataForHome.ProductTypes = await _context.ProductTypes.OrderBy(o => o.Title).ToListAsync();
            dataForHome.Lecturers = await _context.Lecturers.OrderBy(o => o.Name).ToListAsync();
            dataForHome.Courses = await _context.Courses.OrderBy(o => o.Title).ToListAsync();
            dataForHome.Years = await _context.Products.GroupBy(p => p.YearOfCreation).Select(y => new Year
            {
                Title = y.Key,
                Counter = y.Count()
            }).OrderBy(o => o.Title).ToListAsync();
            dataForHome.Degree = await _context.Products.GroupBy(p => p.Degree).Select(y => new Degree
            {
                Title = y.Key,
                Counter = y.Count()
            }).ToListAsync();

            return dataForHome;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Media> GetMedia(int id)
        {
            return await _context.Media.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<bool> ProductExists(int id)
        {
            if (await _context.Products.AnyAsync(x => x.Id == id))
                return true;

            return false;
        }

        public async Task<Product> CreateProduct(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<ProductType> GetType(int id)
        {
            var type = await _context.ProductTypes
            .FirstOrDefaultAsync(t => t.Id == id);

            return type;
        }

        public async Task<IEnumerable<ProductType>> GetTypes()
        {
            var types = await _context.ProductTypes
            .OrderBy(i => i.Title).ToListAsync();
            return types;
        }
        public async Task<Tag> GetTag(int id)
        {
            var tag = await _context.Tags
            .FirstOrDefaultAsync(t => t.Id == id);

            return tag;
        }

        public async Task<IEnumerable<Tag>> GetTags()
        {
            var tags = await _context.Tags
            .OrderBy(i => i.Title).ToListAsync();
            return tags;
        }
        public async Task<Student> GetStudent(int id)
        {
            var student = await _context.Students
            .FirstOrDefaultAsync(t => t.Id == id);

            return student;
        }

        public async Task<IEnumerable<Student>> GetStudents()
        {
            var students = await _context.Students
            .OrderBy(i => i.Name).ToListAsync();
            return students;
        }
        public async Task<Lecturer> GetLecturer(int id)
        {
            var lecturer = await _context.Lecturers
            .FirstOrDefaultAsync(t => t.Id == id);

            return lecturer;
        }

        public async Task<IEnumerable<Lecturer>> GetLecturers()
        {
            var lecturers = await _context.Lecturers
           .OrderBy(i => i.Name).ToListAsync();
            return lecturers;
        }

        public async Task<Course> GetCourse(int id)
        {
            var course = await _context.Courses
            .FirstOrDefaultAsync(t => t.Id == id);

            return course;
        }

        public async Task<IEnumerable<Course>> GetCourses()
        {
            var courses = await _context.Courses
            .OrderBy(i => i.Title).ToListAsync();
            return courses;
        }

        public async Task<Models.Task> GetTask(int id)
        {
            var task = await _context.Tasks
            
            .FirstOrDefaultAsync(t => t.Id == id);

            return task;
        }

        public async Task<IEnumerable<Models.Task>> GetTasks()
        {
            var tasks = await _context.Tasks
            .OrderBy(i => i.Title).ToListAsync();
            return tasks;
        }

        public async Task<Organization> GetOrganization(int id)
        {
            var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.Id == id);

            return organization;
        }

        public async Task<IEnumerable<Organization>> GetOrganizations()
        {
            var organizations = await _context.Organizations
            .OrderBy(i => i.Title).ToListAsync();

            return organizations;
        }

        public async Task<OrganizationType> GetOrganizationType(int id)
        {
            var organizationType = await _context.OrganizationTypes
            .FirstOrDefaultAsync(o => o.Id == id);

            return organizationType;
        }

        public async Task<IEnumerable<OrganizationType>> GetOrganizationTypes()
        {
            var organizationTypes = await _context.OrganizationTypes
            .OrderBy(i => i.Title).ToListAsync();

            return organizationTypes;
        }

        public async Task<IEnumerable<object>> GetUsers()
        {

            var userList = await _context.Users
            .OrderBy(x => x.UserName)
            .Select(user => new
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                Roles = (from userRole in user.UserRoles
                         join role in _context.Roles
                         on userRole.RoleId
                         equals role.Id
                         select role.Name).ToList()
            }).ToListAsync();

            return userList;
        }
    }
}