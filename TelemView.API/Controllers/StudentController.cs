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
    public class StudentController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public StudentController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var studentsFromRepo = await _repo.GetStudents();

            var studentsToReturn = _mapper.Map<IEnumerable<StudentDto>>(studentsFromRepo);

            return Ok(studentsToReturn);
        }

        [HttpGet("{id}", Name = "GetStudent")]
        public async Task<IActionResult> GetStudent(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var studentFromRepo = await _repo.GetStudent(id);

            var studentToReturn = _mapper.Map<StudentDto>(studentFromRepo);

            return Ok(studentToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, int userId, StudentDto studentDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var studentFromRepo = await _repo.GetStudent(id);
            studentDto.Id = studentFromRepo.Id;
            _mapper.Map(studentDto, studentFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating student {id} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var studentFromRepo = await _repo.GetStudent(id);
            var studentToCheck = _mapper.Map<StudentDto>(studentFromRepo);
            if (studentToCheck.Counter != 0)
            {
                return BadRequest("student has products");
            }
            _repo.Delete(studentFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the student");
        }

        [HttpPost]
        public async Task<IActionResult> AddStudent(int userId, StudentDto studentDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var studentsFromRepo = await _repo.GetStudents();
            foreach (var student in studentsFromRepo)
            {
                if (student.Name.Trim() == studentDto.Name.Trim())
                    return BadRequest($"student {student.Name} already exists");
            }
            studentDto.Name=studentDto.Name.Trim();
            var newStudent = _mapper.Map<Student>(studentDto);
            _repo.Add(newStudent);
            if (await _repo.SaveAll())
            {
                var studentToReturn = _mapper.Map<StudentDto>(newStudent);
                return CreatedAtRoute("GetStudent"
                    , new { userId = userId, id = newStudent.Id }
                    , studentToReturn);
            }
            return BadRequest("Failed to add the student");
        }
    }
}