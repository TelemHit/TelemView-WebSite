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
    public class CourseController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public CourseController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var coursesFromRepo = await _repo.GetCourses();

            var coursesToReturn = _mapper.Map<IEnumerable<CourseDto>>(coursesFromRepo);

            return Ok(coursesToReturn);
        }

        [HttpGet("{id}", Name = "GetCourse")]
        public async Task<IActionResult> GetCourse(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var courseFromRepo = await _repo.GetCourse(id);

            var courseToReturn = _mapper.Map<CourseDto>(courseFromRepo);

            return Ok(courseToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, int userId, CourseDto courseDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var courseFromRepo = await _repo.GetCourse(id);
            courseDto.Id = courseFromRepo.Id;
            _mapper.Map(courseDto, courseFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating course {id} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var courseFromRepo = await _repo.GetCourse(id);
            var courseToCheck = _mapper.Map<CourseDto>(courseFromRepo);
            if (courseToCheck.Counter != 0)
            {
                return BadRequest("course has products");
            }
            _repo.Delete(courseFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the course");
        }

        [HttpPost]
        public async Task<IActionResult> AddCourse(int userId, CourseDto courseDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var coursesFromRepo = await _repo.GetCourses();
            foreach (var course in coursesFromRepo)
            {
                if (course.Title.Trim() == courseDto.Title.Trim())
                    return BadRequest($"student {course.Title} already exists");
            }
            courseDto.Title=courseDto.Title.Trim();
            var newCourse = _mapper.Map<Course>(courseDto);
            _repo.Add(newCourse);
            if (await _repo.SaveAll())
            {
                var courseToReturn = _mapper.Map<CourseDto>(newCourse);
                return CreatedAtRoute("GetCourse"
                    , new { userId = userId, id = newCourse.Id }
                    , courseToReturn);
            }
            return BadRequest("Failed to add the course");
        }
    }
}