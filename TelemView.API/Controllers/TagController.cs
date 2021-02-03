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

//this controller responsible for Tags table
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public TagController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        //get all tags
        [HttpGet]
        public async Task<IActionResult> GetTags(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tagsFromRepo = await _repo.GetTags();

            var tagsToReturn = _mapper.Map<IEnumerable<TagDto>>(tagsFromRepo);

            return Ok(tagsToReturn);
        }

        //get specific tag
        [HttpGet("{id}", Name = "GetTag")]
        public async Task<IActionResult> GetTag(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tagFromRepo = await _repo.GetTag(id);

            var tagToReturn = _mapper.Map<TagDto>(tagFromRepo);

            return Ok(tagToReturn);
        }

        //update Tag
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTag(int id, int userId, TagDto tagDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tagFromRepo = await _repo.GetTag(id);
            tagDto.Id = tagFromRepo.Id;
            _mapper.Map(tagDto, tagFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating tag {id} failed on save");
        }

        //delete Tag
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tagFromRepo = await _repo.GetTag(id);
            var tagToCheck = _mapper.Map<TagDto>(tagFromRepo);
            if (tagToCheck.Counter != 0)
            {
                return BadRequest("Tag has products");
            }
            _repo.Delete(tagFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the tag");
        }

        //add new Tag
        [HttpPost]
        public async Task<IActionResult> AddTag(int userId, TagDto tagDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tagsFromRepo = await _repo.GetTags();
            foreach (var tag in tagsFromRepo)
            {
                if (tag.Title.Trim() == tagDto.Title.Trim())
                    return BadRequest($"tag {tag.Title} already exists");
            }
            tagDto.Title = tagDto.Title.Trim();
            var newTag = _mapper.Map<Tag>(tagDto);
            _repo.Add(newTag);
            if (await _repo.SaveAll())
            {
                var tagToReturn = _mapper.Map<TagDto>(newTag);
                return CreatedAtRoute("GetTag"
                    , new { userId = userId, id = newTag.Id }
                    , tagToReturn);
            }
            return BadRequest("Failed to add the tag");
        }
    }
}