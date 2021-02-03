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

//this controller responsible for Organizations table
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public OrganizationController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        //get all Organizations
        [HttpGet]
        public async Task<IActionResult> GetOrganizations(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var organizationsFromRepo = await _repo.GetOrganizations();

            var organizationsToReturn = _mapper.Map<IEnumerable<OrganizationDto>>(organizationsFromRepo);

            return Ok(organizationsToReturn);
        }

        //get specific Organization
        [HttpGet("{id}", Name = "GetOrganization")]
        public async Task<IActionResult> GetOrganization(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var organizationFromRepo = await _repo.GetOrganization(id);

            var organizationToReturn = _mapper.Map<OrganizationDto>(organizationFromRepo);

            return Ok(organizationToReturn);
        }

        //update Organization
        [HttpPut("{id}")]
        public async Task<IActionResult> updateOrganization(int id, int userId, OrganizationDto organizationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var organizationFromRepo = await _repo.GetOrganization(id);
            organizationDto.Id = organizationFromRepo.Id;
            _mapper.Map(organizationDto, organizationFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating organization {id} failed on save");
        }

        //delete Organization
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganization(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var organizationFromRepo = await _repo.GetOrganization(id);
            var organizationToCheck = _mapper.Map<OrganizationDto>(organizationFromRepo);
            if (organizationToCheck.Counter != 0)
            {
                return BadRequest("student has products");
            }
            _repo.Delete(organizationFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the organization");
        }

        //add new Organization
        [HttpPost]
        public async Task<IActionResult> AddOrganization(int userId, OrganizationDto organizationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var organizationsFromRepo = await _repo.GetOrganizations();
            foreach (var org in organizationsFromRepo)
            {
                if (org.Title.Trim() == organizationDto.Title.Trim())
                    return BadRequest($"organization {org.Title} already exists");
            }
            if (organizationDto.OrganizationTypes.Count == 0)
                return BadRequest("no types selected");

            organizationDto.Title = organizationDto.Title.Trim();
            var newOrganization = _mapper.Map<Organization>(organizationDto);
            _repo.Add(newOrganization);

            if (await _repo.SaveAll())
            {
                var organizationToReturn = _mapper.Map<OrganizationDto>(newOrganization);
                return CreatedAtRoute("GetOrganization"
                    , new { userId = userId, id = newOrganization.Id }
                    , organizationToReturn);
            }
            return BadRequest("Failed to add the organization");
        }
    }
}
