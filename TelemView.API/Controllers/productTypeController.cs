using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Models;

//this controller responsible for productTypes table
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class productTypeController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public productTypeController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        //get all productTypes
        [HttpGet]
        public async Task<IActionResult> GetProductTypes(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var types = await _repo.GetTypes();

            var typesToReturn = _mapper.Map<IEnumerable<ProductTypeDto>>(types);

            return Ok(typesToReturn);
        }

        //get specific productType
        [HttpGet("{id}", Name = "GetProductType")]
        public async Task<IActionResult> GetProductType(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var type = await _repo.GetType(id);

            var typesToReturn = _mapper.Map<ProductTypeDto>(type);

            return Ok(typesToReturn);
        }

        //update productType
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductType(int id, int userId, ProductTypeDto productTypeDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var typeFromRepo = await _repo.GetType(id);
            _mapper.Map(productTypeDto, typeFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating type {id} failed on save");
        }

        //delete productType
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductType(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var typeFromRepo = await _repo.GetType(id);
            var typesToCheck = _mapper.Map<ProductTypeDto>(typeFromRepo);
            if (typesToCheck.Counter != 0)
            {
                return BadRequest("Type has products");
            }
            _repo.Delete(typeFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the type");
        }

        //add new productType
        [HttpPost]
        public async Task<IActionResult> AddProductType(int userId, ProductTypeDto productTypeDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var ptFromRepo = await _repo.GetTypes();
            foreach (var pt in ptFromRepo)
            {
                if (pt.Title.Trim() == productTypeDto.Title.Trim())
                    return BadRequest($"type {productTypeDto.Title} already exists");
            }
            productTypeDto.Title = productTypeDto.Title.Trim();
            var newPt = _mapper.Map<ProductType>(productTypeDto);
            _repo.Add(newPt);
            if (await _repo.SaveAll())
            {
                var ptToReturn = _mapper.Map<ProductTypeDto>(newPt);
                return CreatedAtRoute("GetProductType"
                    , new { userId = userId, id = newPt.Id }
                    , ptToReturn);
            }
            return BadRequest("Failed to add the type");
        }
    }
}