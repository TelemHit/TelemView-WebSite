using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Helpers;

namespace TelemView.API.Controllers
{
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
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery]ProductParams productParams)
        {
            var products = await _repo.GetProducts(productParams);
            var productsToReturn = _mapper.Map<IEnumerable<ProductForHomeDto>>(products);
            return Ok(productsToReturn);
            //return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _repo.GetProduct(id);
            var productToReturn = _mapper.Map<ProductDetailsDto>(product);
            return Ok(productToReturn);
            //return Ok(product);
        }
    }
}