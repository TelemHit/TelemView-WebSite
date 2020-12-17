using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Helpers;
using TelemView.API.Models;

namespace TelemView.API.Controllers
{
    [Authorize]
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
        public async Task<IActionResult> GetProducts([FromQuery] ProductParams productParams)
        {
            var products = await _repo.GetProducts(productParams);

            var productsToReturn = _mapper.Map<IEnumerable<ProductForHomeDto>>(products);

            Response.AddPagination(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);

            return Ok(productsToReturn);
            //return Ok(products);
        }

        [AllowAnonymous]
        [HttpGet("{id}", Name = "GetProduct")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _repo.GetProduct(id);
            var productToReturn = _mapper.Map<ProductDetailsDto>(product);
            return Ok(productToReturn);
            //return Ok(product);
        }

        [HttpPost("editor/{userId}", Name = "CreateProduct")]
        public async Task<IActionResult> CreateProduct(int userId, ProductUpdateDto productUpdateDto)
        {

            var productToAdd = _mapper.Map<Product>(productUpdateDto);

            await _repo.CreateProduct(productToAdd);

            var productToReturn = _mapper.Map<ProductIdDto>(productToAdd);

            var productFromRepo = await _repo.GetProduct(productToReturn.Id);
            productFromRepo.IsPublish = true;
            productFromRepo.TimeStamp= DateTime.Now;
            await _repo.SaveAll();

            return CreatedAtRoute("GetProduct"
                    , new { userId = userId, id = productToAdd.Id }
                    , productToReturn);

        }

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
                productFromRepo.TimeStamp=DateTime.Now;
                _mapper.Map(productUpdateDto, productFromRepo);

                if (await _repo.SaveAll())
                    return NoContent();

                throw new Exception($"Updating product {id} failed on save");
            }
            throw new Exception($"No product Id: {id}");

        }

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

