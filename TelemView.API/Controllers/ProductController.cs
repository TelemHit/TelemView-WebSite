using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Helpers;
using TelemView.API.Models;

//this controller responsible for Products table
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public ProductController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }
        [AllowAnonymous]
        [HttpGet]

        //get all products
        public async Task<IActionResult> GetProducts([FromQuery] ProductParams productParams)
        {
            //get products and general data for filters and lists
            var products = await _repo.GetProducts(productParams);
            var generalDataFromRepo = await _repo.GetGeneralData();
            var productsToReturn = _mapper.Map<IEnumerable<ProductForHomeDto>>(products);
            var generalDataToReturn = _mapper.Map<DataForHomeDto>(generalDataFromRepo);
            //get all products without paging for calculation of counters
            // var itemsBeforePaging = _mapper.Map<IEnumerable<ProductForHomeDto>>(products.AllItems);

            //calculate filters for current products list - currently not in use
            // foreach (var year in generalDataToReturn.Years)
            // {
            //     year.FilteredCounter = itemsBeforePaging.Where(p => p.YearOfCreation == year.Title).Count();
            // }
            // foreach (var degree in generalDataToReturn.Degree)
            // {
            //     degree.FilteredCounter = itemsBeforePaging.Where(p => p.Degree == degree.Title).Count();
            // }
            // foreach (var course in generalDataToReturn.Courses)
            // {
            //     course.FilteredCounter = itemsBeforePaging.Where(p => p.Courses.Any(c => c.Id == course.Id)).Count();
            // }
            // foreach (var org in generalDataToReturn.Organizations)
            // {
            //     org.FilteredCounter = itemsBeforePaging.Where(p => p.OrganizationId == org.Id).Count();
            // }
            // foreach (var orgType in generalDataToReturn.OrganizationTypes)
            // {
            //     orgType.FilteredCounter = itemsBeforePaging.Where(p => p.OrganizationTypes.Any(ot => ot.Id == orgType.Id)).Count();
            // }
            // foreach (var lect in generalDataToReturn.Lecturers)
            // {
            //     lect.FilteredCounter = itemsBeforePaging.Where(p => p.Lecturers.Any(l => l.Id == lect.Id)).Count();
            // }
            // foreach (var task in generalDataToReturn.Tasks)
            // {
            //     task.FilteredCounter = itemsBeforePaging.Where(p => p.TaskId == task.Id).Count();
            // }
            // foreach (var pt in generalDataToReturn.ProductTypes)
            // {
            //     pt.FilteredCounter = itemsBeforePaging.Where(p => p.ProductTypeId == pt.Id).Count();
            // }

            //set all data in one class
            var rootData = new RootForHomeDto();
            rootData.Products = productsToReturn;
            rootData.GeneralData = generalDataToReturn;

            //add pagination headers
            Response.AddPagination(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);

            return Ok(rootData);
        }

        //get specific product
        [AllowAnonymous]
        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<IActionResult> GetProduct(int id)
        {
            if (await _repo.ProductExists(id))
            {
                var product = await _repo.GetProduct(id);
                var productToReturn = _mapper.Map<ProductDetailsDto>(product);
                return Ok(productToReturn);
            }
            return BadRequest("product not exists");
        }

        //create new product
        [HttpPost("editor/{userId}", Name = "CreateProduct")]
        public async Task<IActionResult> CreateProduct(int userId, ProductUpdateDto productUpdateDto)
        {

            var productToAdd = _mapper.Map<Product>(productUpdateDto);
            //by default product is publish
            productToAdd.IsPublish = true;
            productToAdd.TimeStamp = DateTime.Now;
            await _repo.CreateProduct(productToAdd);

            var productToReturn = _mapper.Map<ProductIdDto>(productToAdd);

            await _repo.SaveAll();

            return CreatedAtRoute("GetProduct"
                    , new { userId = userId, id = productToAdd.Id }
                    , productToReturn);
        }

        //set publish product column
        [HttpPost("editor/publish/{userId}/{id}")]
        public async Task<IActionResult> PublishProduct(int userId, int id)
        {
            if (await _repo.ProductExists(id))
            {
                var productFromRepo = await _repo.GetProduct(id);
                if (productFromRepo.IsPublish)
                {
                    productFromRepo.IsPublish = false;
                }
                else
                {
                    productFromRepo.IsPublish = true;
                }
                if (await _repo.SaveAll())
                    return NoContent();

                return BadRequest("could not publish");
            }
            else
            {
                return BadRequest($"no product with id: {id}");
            }
        }

        //show product on home page - currently not in use
        [HttpPost("editor/homePage/{userId}/{id}")]
        public async Task<IActionResult> ProductOnHomePage(int userId, int id)
        {
            if (await _repo.ProductExists(id))
            {
                var productFromRepo = await _repo.GetProduct(id);
                if (productFromRepo.ShowOnHomePage)
                {
                    productFromRepo.ShowOnHomePage = false;
                }
                else
                {
                    productFromRepo.ShowOnHomePage = true;
                }
                if (await _repo.SaveAll())
                    return NoContent();

                return BadRequest("could not set on Home Page");
            }
            return BadRequest($"no product with id: {id}");
        }

        //update product
        [HttpPut("{userId}/{id}")]
        public async Task<IActionResult> UpdateProduct(int userId, int id, ProductUpdateDto productUpdateDto)
        {
            if (await _repo.ProductExists(id))
            {
                var productFromRepo = await _repo.GetProduct(id);
                try
                {
                    if (productUpdateDto.Media.Count > 0)
                    {
                        ICollection<MediaDto> tempMediaList = new List<MediaDto>(productUpdateDto.Media);
                        foreach (MediaDto m in tempMediaList)
                        {
                            if (m.Status == "Temp")
                            {
                                m.Status = "Saved";
                            }
                            if (m.Status == "Delete")
                            {
                                if (m.IsMain)
                                    return BadRequest("You can not delete your main photo");

                                if (m.Type == "image" || m.Type == "file")
                                {
                                    if (m.Url != null)
                                    {
                                        var fileName = m.Url;
                                        var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\images", fileName);

                                        if (System.IO.File.Exists(filePath))
                                        {
                                            System.IO.File.Delete(filePath);
                                        }
                                    }
                                }

                                productUpdateDto.Media.Remove(m);
                            }
                        }
                    }
                }
                catch
                {

                }
                productFromRepo.TimeStamp = DateTime.Now;
                _mapper.Map(productUpdateDto, productFromRepo);

                if (await _repo.SaveAll())
                    return NoContent();

                throw new Exception($"Updating product {id} failed on save");
            }
            throw new Exception($"No product Id: {id}");

        }

        //delete product
        [HttpDelete("editor/{userId}/{id}")]
        public async Task<IActionResult> DeleteProduct(int userId, int id)
        {

            var productFromRepo = await _repo.GetProduct(id);

            var mediaFromRepo = productFromRepo.Media;

            foreach (Media m in mediaFromRepo)
            {
                if (m.Type == "image" || m.Type == "file")
                {
                    if (m.Url != null)
                    {
                        var fileName = m.Url;
                        var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\images", fileName);

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                    }
                }
            }

            _repo.Delete(productFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the product");

        }

    }
}

