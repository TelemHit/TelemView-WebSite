using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelemView.API.Helpers;
using TelemView.API.Models;

//the main repository of the project
//controls all data managment except Authorazation which controled by dotnet core Identity
namespace TelemView.API.Data
{
    public class TelemRepository : ITelemRepository
    {
        private readonly DataContext _context;
        public TelemRepository(DataContext context)
        {
            _context = context;
        }

        //get all published products
        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            var productIds = await _context.Products
            .Where(p => p.IsPublish==true).ToListAsync();
            return productIds;
        }

        //get products from DB by filter
        public async Task<PagedList<Product>> GetProducts(ProductParams productParams)
        {
            //get products as queryable because we query it later for paging
            var products = _context.Products
            .OrderByDescending(p => p.TimeStamp).AsQueryable();

            //get products according to user parameters
            //this include filters, search and if user is in edit mode or not
            if (productParams.IsClient == true)
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
                products = products.Where(p => productParams.Degree.Contains(p.Degree));
            }
            // if (productParams.Search != null && productParams.IsClient == true)
            // {
            //     // if client - search by product name only
            //     products = products.Where(p => p.Title.ToLower().Trim().Contains(productParams.Search.ToLower().Trim()));
            // }
            // if (productParams.Search != null && productParams.IsClient == false)
            if (productParams.Search != null)
            {
                // if editor - search by all params
                var filteredProducts = products.Where(p => p.Title.ToLower().Trim().Contains(productParams.Search.ToLower().Trim()));
                var filteredYears = products.Where(p => p.YearOfCreation.ToString().Contains(productParams.Search.ToLower().Trim()));
                var filteredDegree = products.Where(p => p.Degree.ToLower().Contains(productParams.Search.ToLower().Trim()));
                var filteredOrg = products.Where(p => p.Organization.Title.ToLower().Contains(productParams.Search.ToLower().Trim()));
                var filteredHeYears = products.Where(p => p.HeYearOfCreation.ToLower().Contains(productParams.Search.ToLower().Trim()));
                var filteredType = products.Where(p => p.ProductType.Title.ToLower().Contains(productParams.Search.ToLower().Trim()));
                var filteredTask = products.Where(p => p.Task.Title.ToLower().Contains(productParams.Search.ToLower().Trim()));
                var filteredLecturers = products.Where(p => p.ProductsLecturers.Any(l => l.Lecturer.Name.Contains(productParams.Search.ToLower().Trim())));
                var filteredStudents = products.Where(p => p.ProductStudents.Any(l => l.Student.Name.Contains(productParams.Search.ToLower().Trim())));
                var filteredTag = products.Where(p => p.ProductsTags.Any(l => l.Tag.Title.Contains(productParams.Search.ToLower().Trim())));
                var filteredOrgType = products.Where(p => p.Organization.OrganizationAndType.Any(l => l.OrganizationType.Title.Contains(productParams.Search.ToLower().Trim())));

                products = filteredProducts.Union(filteredYears).Union(filteredDegree).Union(filteredOrg)
                .Union(filteredType).Union(filteredTask).Union(filteredLecturers).Union(filteredStudents)
                .Union(filteredTag).Union(filteredOrgType).Union(filteredHeYears);
            }

            //we return paged data - each time only part of data according to user paging parameters
            return await PagedList<Product>.CreateAsync(products, productParams.PageNumber, productParams.PageSize);
        }

        //get a list of search suggestions
        public async Task<IEnumerable<string>> GetSearchAutoComplete(string searchInput)
        {
            var listToReturn = new List<string>();
            var total = 10;

            //products
            var products = _context.Products.AsQueryable();
            listToReturn = listToReturn.Union(await products.Where(pr => pr.IsPublish == true)
            .Select(p => p.Title)
            .Where(t => t.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            //check if list is greather then 20
            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //types
            var types = _context.ProductTypes.AsQueryable();
            listToReturn = listToReturn.Union(await types.Where(t => t.Products.Any(p => p.IsPublish == true)).Select(n => n.Title.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //lecturers
            var lecturers = _context.Lecturers.AsQueryable();
            listToReturn = listToReturn.Union(await lecturers.Where(l => l.ProductsLecturers.Any(t => t.Product.IsPublish == true)).Select(n => n.Name.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //organizations
            var org = _context.Organizations.AsQueryable();
            listToReturn = listToReturn.Union(await org.Where(o => o.Products.Any(p => p.IsPublish == true)).Select(n => n.Title.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //students
            var students = _context.Students.AsQueryable();
            listToReturn = listToReturn.Union(await students.Where(s => s.ProductStudents.Any(t => t.Product.IsPublish == true)).Select(n => n.Name.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //tasks
            var tasks = _context.Tasks.AsQueryable();
            listToReturn = listToReturn.Union(await tasks.Where(t => t.Products.Any(p => p.IsPublish == true)).Select(n => n.Title.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //courses
            var courses = _context.Courses.AsQueryable();
            listToReturn = listToReturn.Union(await courses.Where(c => c.ProductsCourses.Any(t => t.Product.IsPublish == true)).Select(n => n.Title.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //tag
            var tags = _context.Tags.AsQueryable();
            listToReturn = listToReturn.Union(await tags.Where(t => t.ProductsTags.Any(t => t.Product.IsPublish == true)).Select(n => n.Title.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //organization types
            var orgTypes = _context.OrganizationTypes.AsQueryable();
            listToReturn = listToReturn.Union(await orgTypes.Where(ot => ot.OrganizationAndType.Any(p => p.Organization.Products.Any(pr => pr.IsPublish == true))).Select(n => n.Title.ToLower()).Where(l => l.Contains(searchInput.ToLower())).ToListAsync()).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //years
            var years = await _context.Products.Where(pr => pr.IsPublish == true).GroupBy(p => p.YearOfCreation).Select(y => new Year
            {
                Title = y.Key,
            }).OrderBy(o => o.Title).ToListAsync();

            listToReturn = listToReturn.Union(years.Select(n => n.Title.ToString()).Where(l => l.Contains(searchInput.ToLower()))).ToList();

            if (listToReturn.Count >= total)
                return listToReturn.Take(total);

            //hebrew years
            var heYears = await _context.Products.Where(pr => pr.IsPublish == true).GroupBy(p => p.HeYearOfCreation).Select(y => new Year
            {
                HeTitle = y.Key,
            }).OrderBy(o => o.HeTitle).ToListAsync();

            listToReturn = listToReturn.Union(heYears.Select(n => n.HeTitle.ToString()).Where(l => l.Contains(searchInput.ToLower()))).ToList();

            //degree
            var degree = await _context.Products.Where(pr => pr.IsPublish == true).GroupBy(p => p.Degree).Select(y => new Degree
            {
                Title = y.Key,
            }).OrderBy(o => o.Title).ToListAsync();

            listToReturn = listToReturn.Union(degree.Select(n => n.Title.ToString()).Where(l => l.Contains(searchInput.ToLower()))).ToList();

            return listToReturn.Take(total);
        }

        //get specific product
        public async Task<Product> GetProduct(int id)
        {
            var product = await _context.Products
            .FirstOrDefaultAsync(u => u.Id == id);
            return product;
        }

        //get data for filters and Edit product page
        public async Task<GeneralData> GetGeneralData()
        {
            var generalData = new GeneralData();
            generalData.Organizations = await _context.Organizations.ToListAsync();
            generalData.OrganizationTypes = await _context.OrganizationTypes.OrderBy(o => o.Title).ToListAsync();
            generalData.Students = await _context.Students.OrderBy(o => o.Name).ToListAsync();
            generalData.Tags = await _context.Tags.OrderBy(o => o.Title).ToListAsync();
            generalData.Tasks = await _context.Tasks.OrderBy(o => o.Title).ToListAsync();
            generalData.ProductTypes = await _context.ProductTypes.OrderBy(o => o.Title).ToListAsync();
            generalData.Lecturers = await _context.Lecturers.OrderBy(o => o.Name).ToListAsync();
            generalData.Courses = await _context.Courses.OrderBy(o => o.Title).ToListAsync();
            generalData.Years = await _context.Products.GroupBy(p => p.YearOfCreation).Select(y => new Year
            {
                Title = y.Key,
                Counter = y.Count()
            }).OrderBy(o => o.Title).ToListAsync();
            generalData.Degree = await _context.Products.GroupBy(p => p.Degree).Select(y => new Degree
            {
                Title = y.Key,
                Counter = y.Count()
            }).ToListAsync();

            return generalData;
        }

        //save data
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        //add new entity
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        //delete entity
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        //get specific media
        public async Task<Media> GetMedia(int id)
        {
            return await _context.Media.FirstOrDefaultAsync(m => m.Id == id);
        }

        //checks if product exist
        public async Task<bool> ProductExists(int id)
        {
            if (await _context.Products.AnyAsync(x => x.Id == id))
                return true;

            return false;
        }

        //add new product to database
        //we first create product and then add all media to it
        public async Task<Product> CreateProduct(Product product)
        {
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        //get product type
        public async Task<ProductType> GetType(int id)
        {
            var type = await _context.ProductTypes
            .FirstOrDefaultAsync(t => t.Id == id);

            return type;
        }

        //get all product types
        public async Task<IEnumerable<ProductType>> GetTypes()
        {
            var types = await _context.ProductTypes
            .OrderBy(i => i.Title).ToListAsync();
            return types;
        }

        //get tag
        public async Task<Tag> GetTag(int id)
        {
            var tag = await _context.Tags
            .FirstOrDefaultAsync(t => t.Id == id);

            return tag;
        }

        //get tags
        public async Task<IEnumerable<Tag>> GetTags()
        {
            var tags = await _context.Tags
            .OrderBy(i => i.Title).ToListAsync();
            return tags;
        }

        //get student
        public async Task<Student> GetStudent(int id)
        {
            var student = await _context.Students
            .FirstOrDefaultAsync(t => t.Id == id);

            return student;
        }

        //get students
        public async Task<IEnumerable<Student>> GetStudents()
        {
            var students = await _context.Students
            .OrderBy(i => i.Name).ToListAsync();
            return students;
        }

        //get lecturer
        public async Task<Lecturer> GetLecturer(int id)
        {
            var lecturer = await _context.Lecturers
            .FirstOrDefaultAsync(t => t.Id == id);

            return lecturer;
        }

        //get lecturers
        public async Task<IEnumerable<Lecturer>> GetLecturers()
        {
            var lecturers = await _context.Lecturers
           .OrderBy(i => i.Name).ToListAsync();
            return lecturers;
        }

        //get course
        public async Task<Course> GetCourse(int id)
        {
            var course = await _context.Courses
            .FirstOrDefaultAsync(t => t.Id == id);

            return course;
        }

        //get courses
        public async Task<IEnumerable<Course>> GetCourses()
        {
            var courses = await _context.Courses
            .OrderBy(i => i.Title).ToListAsync();
            return courses;
        }

        //get task
        public async Task<Models.Task> GetTask(int id)
        {
            var task = await _context.Tasks

            .FirstOrDefaultAsync(t => t.Id == id);

            return task;
        }

        //get tasks
        public async Task<IEnumerable<Models.Task>> GetTasks()
        {
            var tasks = await _context.Tasks
            .OrderBy(i => i.Title).ToListAsync();
            return tasks;
        }

        //get organization
        public async Task<Organization> GetOrganization(int id)
        {
            var organization = await _context.Organizations
            .FirstOrDefaultAsync(o => o.Id == id);

            return organization;
        }

        //get organizations
        public async Task<IEnumerable<Organization>> GetOrganizations()
        {
            var organizations = await _context.Organizations
            .OrderBy(i => i.Title).ToListAsync();

            return organizations;
        }

        //get organization type
        public async Task<OrganizationType> GetOrganizationType(int id)
        {
            var organizationType = await _context.OrganizationTypes
            .FirstOrDefaultAsync(o => o.Id == id);

            return organizationType;
        }

        //get organization types
        public async Task<IEnumerable<OrganizationType>> GetOrganizationTypes()
        {
            var organizationTypes = await _context.OrganizationTypes
            .OrderBy(i => i.Title).ToListAsync();

            return organizationTypes;
        }

        //get users
        public async Task<IEnumerable<object>> GetUsers()
        {

            var userList = await _context.Users
            .OrderBy(x => x.UserName)
            .Select(user => new
            {
                Id = user.Id,
                Email = user.Email,
                EmailConfirmation = user.EmailConfirmed,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
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