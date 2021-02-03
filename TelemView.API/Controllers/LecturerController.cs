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

//this controller responsible for Lecturers table
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "Edit")]
    [Route("api/[controller]/{userId}")]
    [ApiController]
    public class LecturerController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public LecturerController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        //get all Lecturers
        [HttpGet]
        public async Task<IActionResult> GetLecturers(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var lecturersFromRepo = await _repo.GetLecturers();

            var lecturersToReturn = _mapper.Map<IEnumerable<LecturersDto>>(lecturersFromRepo);

            return Ok(lecturersToReturn);
        }

        //get specific Lecturer
        [HttpGet("{id}", Name = "GetLecturer")]
        public async Task<IActionResult> GetLecturer(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var lecturerFromRepo = await _repo.GetLecturer(id);

            var lecturerToReturn = _mapper.Map<LecturersDto>(lecturerFromRepo);

            return Ok(lecturerToReturn);
        }

        //update Lecturer
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLecturer(int id, int userId, LecturersDto lecturersDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var lecturerFromRepo = await _repo.GetLecturer(id);
            lecturersDto.Id = lecturerFromRepo.Id;
            _mapper.Map(lecturersDto, lecturerFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating lecturer {id} failed on save");
        }

        //delete Lecturer
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLecturer(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var lecturerFromRepo = await _repo.GetLecturer(id);
            var lecturerToCheck = _mapper.Map<LecturersDto>(lecturerFromRepo);
            if (lecturerToCheck.Counter != 0)
            {
                return BadRequest("lecturer has products");
            }
            _repo.Delete(lecturerFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the lecturer");
        }

        //add new Lecturer
        [HttpPost]
        public async Task<IActionResult> AddLecturer(int userId, LecturersDto lecturersDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var lecturersFromRepo = await _repo.GetLecturers();
            foreach (var lecturer in lecturersFromRepo)
            {
                if (lecturer.Name.Trim() == lecturersDto.Name.Trim())
                    return BadRequest($"lecturer {lecturer.Name} already exists");
            }

            lecturersDto.Name = lecturersDto.Name.Trim();
            var newLecturer = _mapper.Map<Lecturer>(lecturersDto);
            _repo.Add(newLecturer);
            if (await _repo.SaveAll())
            {
                var lecturerToReturn = _mapper.Map<LecturersDto>(newLecturer);
                return CreatedAtRoute("GetLecturer"
                    , new { userId = userId, id = newLecturer.Id }
                    , lecturerToReturn);
            }
            return BadRequest("Failed to add the lecturer");
        }
    }
}
