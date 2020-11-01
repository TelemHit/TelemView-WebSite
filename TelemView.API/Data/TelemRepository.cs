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

        public async Task<IEnumerable<Product>> GetProducts(ProductParams productParams)
        {
            var products = await _context.Products
            .Include(t => t.Task)
            .Include(pt => pt.ProductType)
            .Include(o => o.Organization)
            .Include(ot => ot.Organization.OrganizationType)
            .Include(m => m.Media)
            .Include(pl => pl.ProductsLecturers).ThenInclude(l => l.Lecturer)
            .Include(pt => pt.ProductsTags).ThenInclude(t => t.Tag)
            .Include(pc => pc.ProductsCourses).ThenInclude(c => c.Course)
            .Include(ps => ps.ProductStudents).ThenInclude(s => s.Student)
            .ToListAsync();
            
            if(productParams.ProductType != null){
                products = products.Where(p => productParams.ProductType.Contains(p.ProductType.Id)).ToList();
            }
            if(productParams.Organizations != null){
                products = products.Where(p => productParams.Organizations.Contains(p.Organization.Id)).ToList();
            }
            if(productParams.Courses != null){
                products = products.Where(p => p.ProductsCourses.Select(c => c.CourseId).Intersect(productParams.Courses).Any()).ToList();
            }
            if(productParams.Lecturers != null){
                products = products.Where(p => p.ProductsLecturers.Select(c => c.LecturerId).Intersect(productParams.Lecturers).Any()).ToList();
            }
            if(productParams.ProductType != null){
                products = products.Where(p => productParams.ProductType.Contains(p.ProductType.Id)).ToList();
            }
            if(productParams.OrganizationTypes != null){
                products = products.Where(p => productParams.OrganizationTypes.Contains(p.Organization.OrganizationType.Id)).ToList();
            }
            if(productParams.Tasks != null){
                products = products.Where(p => productParams.Tasks.Contains(p.Task.Id)).ToList();
            }
            if(productParams.Years != null){
                products = products.Where(p => productParams.Years.Contains(p.YearOfCreation)).ToList();
            }
            if(productParams.Degrees != null){
                products = products.Where(p => productParams.Degrees.Contains(p.Degree)).ToList();
            }
            if(productParams.Search!=null){
                char[] charsToTrim = { '*', ' ', '\'', '-'};
                products = products.Where(p => p.Title.ToLower().Trim(charsToTrim).Contains(productParams.Search.ToLower().Trim(charsToTrim))).ToList();
            }

            return products;
        }


        public async Task<Product> GetProduct(int id)
        {
            var product=await _context.Products
            .Include(m => m.Media)
            .Include(t => t.Task)
            .Include(pt => pt.ProductType)
            .Include(o => o.Organization)
            .Include(ot => ot.Organization.OrganizationType)
            .Include(m => m.Media)
            .Include(pl => pl.ProductsLecturers).ThenInclude(l => l.Lecturer)
            .Include(pt => pt.ProductsTags).ThenInclude(t => t.Tag)
            .Include(pc => pc.ProductsCourses).ThenInclude(c => c.Course)
            .Include(ps => ps.ProductStudents).ThenInclude(s => s.Student)
            .FirstOrDefaultAsync(u => u.Id == id);
            return product;
        }

        public async Task<DataForHome> GetDataForHome()
        {
            var dataForHome= new DataForHome();
            dataForHome.Organizations=await _context.Organizations.Include(p => p.Products).ToListAsync();
            dataForHome.OrganizationTypes = await _context.OrganizationTypes.Include(o => o.Organizations).ThenInclude(p => p.Products).ToListAsync();
            dataForHome.Students = await _context.Students.Include(p => p.ProductStudents).ThenInclude(p => p.Product).ToListAsync();
            dataForHome.Tags = await _context.Tags.Include(p => p.ProductsTags).ThenInclude(p => p.Product).ToListAsync();
            dataForHome.Tasks = await _context.Tasks.Include(p => p.Products).ToListAsync();
            dataForHome.ProductTypes = await _context.ProductTypes.Include(p => p.Products).ToListAsync();
            dataForHome.Lecturers = await _context.Lecturers.Include(p => p.ProductsLecturers).ThenInclude(p => p.Product).ToListAsync();
            dataForHome.Courses = await _context.Courses.Include(p => p.ProductsCourses).ThenInclude(p => p.Product).ToListAsync();
            dataForHome.Years = await _context.Products.GroupBy(p => p.YearOfCreation).Select(y => new Year {
                Title = y.Key,
                Counter = y.Count()
            }).ToListAsync();
            dataForHome.Degree = await _context.Products.GroupBy(p => p.Degree).Select(y => new Degree {
                Title = y.Key,
                Counter = y.Count()
            }).ToListAsync();

            return dataForHome;
        }

    }
}