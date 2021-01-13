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

namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class OrganizationTypeController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public OrganizationTypeController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrganizationTypes(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var otFromRepo = await _repo.GetOrganizationTypes();

            var otToReturn = _mapper.Map<IEnumerable<OrganizationTypeDto>>(otFromRepo);

            return Ok(otToReturn);
        }

        [HttpGet("{id}", Name = "GetOrganizationType")]
        public async Task<IActionResult> GetOrganizationType(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var otFromRepo = await _repo.GetOrganizationType(id);

            var otToReturn = _mapper.Map<OrganizationTypeDto>(otFromRepo);

            return Ok(otToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrganizationType(int id, int userId, OrganizationTypeDto organizationTypeDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var otFromRepo = await _repo.GetOrganizationType(id);
            organizationTypeDto.Id = otFromRepo.Id;
            _mapper.Map(organizationTypeDto, otFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating organization type {id} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganizationType(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var otFromRepo = await _repo.GetOrganizationType(id);
            if (otFromRepo.OrganizationAndType.Count > 0)
            {
                return BadRequest("organization type has organizations");
            }
            _repo.Delete(otFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the organization type");
        }

        [HttpPost]
        public async Task<IActionResult> AddOrganizationType(int userId, OrganizationTypeDto organizationTypeDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var otFromRepo = await _repo.GetOrganizationTypes();
            foreach (var ot in otFromRepo)
            {
                if (ot.Title.Trim() == organizationTypeDto.Title.Trim())
                    return BadRequest($"organization type {ot.Title} already exists");
            }
            organizationTypeDto.Title=organizationTypeDto.Title.Trim();
            var newOt = _mapper.Map<OrganizationType>(organizationTypeDto);
            _repo.Add(newOt);
            if (await _repo.SaveAll())
            {
                var otToReturn = _mapper.Map<OrganizationTypeDto>(newOt);
                return CreatedAtRoute("GetOrganizationType"
                    , new { userId = userId, id = newOt.Id }
                    , otToReturn);
            }
            return BadRequest("Failed to add the organization type");
        }
    }
}