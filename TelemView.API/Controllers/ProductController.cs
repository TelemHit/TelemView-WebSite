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
            return Ok(productsToReturn);
            //return Ok(products);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _repo.GetProduct(id);
            var productToReturn = _mapper.Map<ProductDetailsDto>(product);
            return Ok(productToReturn);
            //return Ok(product);
        }

        [HttpPut("{userId}/{id}")]
        public async Task<IActionResult> UpdateProduct(int userId, int id, ProductUpdateDto productUpdateDto)
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

            _mapper.Map(productUpdateDto, productFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating product {id} failed on save");
        }
    }
}

