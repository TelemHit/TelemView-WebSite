using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Models;

namespace TelemView.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralDataController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public GeneralDataController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetDataForHome()
        {
            var dataForHome = await _repo.GetDataForHome();
            var dataToReturn = _mapper.Map<DataForHomeDto>(dataForHome);
            //return Ok(dataForHome);
            return Ok(dataToReturn);
        }

        // [HttpPut("editor/updateStudent/{userId}")]
        // public async Task<IActionResult> UpdateStudent(DataForUpdateDto dataForUpdateDto)
        // {
        //     var studentName = dataForUpdateDto.Name.Trim();
        //     if (await _repo.StudentExists(studentName))
        //         return BadRequest("student already exists");
            

        //     var studentToAdd = new Student
        //     {
        //         Name = studentName
        //     };
        //     var studentToReturn = await _repo.AddStudent(studentToAdd);
        //     return Ok(studentToReturn);
        // }

        // [HttpPut("editor/updateLecturer/{userId}")]
        // public async Task<IActionResult> UpdateLecturer(DataForUpdateDto dataForUpdateDto)
        // {
        //     var lecturerName = dataForUpdateDto.Name.Trim();
        //     if (await _repo.LecturerExists(lecturerName))
        //         return BadRequest("lecturer already exists");
            

        //     var lecturerToAdd = new Lecturer
        //     {
        //         Name = lecturerName
        //     };
        //     var lecturerToReturn = await _repo.AddLecturer(lecturerToAdd);
        //     return Ok(lecturerToReturn);
        // }

        // [HttpPut("editor/updateTag/{userId}")]
        // public async Task<IActionResult> UpdateTag(DataForUpdateDto dataForUpdateDto)
        // {
        //     var tagTitle = dataForUpdateDto.Title.Trim();
        //     if (await _repo.TagExists(tagTitle))
        //         return BadRequest("tag already exists");

        //     var tagToAdd = new Tag
        //     {
        //         Title = tagTitle
        //     };
        //     var tagToReturn = await _repo.AddTag(tagToAdd);
        //     return Ok(tagToReturn);
        // }

        // [HttpPut("editor/updateCourse/{userId}")]
        // public async Task<IActionResult> UpdateCourse(DataForUpdateDto dataForUpdateDto)
        // {
        //     var courseTitle = dataForUpdateDto.Title.Trim();
        //     var courseNumber = dataForUpdateDto.Number;
        //     if (await _repo.CourseExists(courseTitle))
        //         return BadRequest("course already exists");

        //     var courseToAdd = new Course
        //     {
        //         Title = courseTitle,
        //         Number = courseNumber
        //     };
        //     var courseToReturn = await _repo.AddCourse(courseToAdd);
        //     return Ok(courseToReturn);
        // }

        // [HttpPut("editor/updateOrganization/{userId}")]
        // public async Task<IActionResult> updateOrganization(OrganizationForUpdate organizationForUpdate)
        // {
        //     var orgTitle = organizationForUpdate.Title.Trim();
        //     var orgTypes = organizationForUpdate.OrganizationTypes.Select(id => id.Id).ToArray();

        //     if (orgTypes.Length == 0)
        //         return BadRequest("no types selected");
        //     if (await _repo.OrganizationExists(orgTitle))
        //         return BadRequest("organization already exists");
            

        //     var organizatinToAdd = new Organization
        //     {
        //         Title = orgTitle
        //     };

        //     var courseToReturn = await _repo.AddOrganization(organizatinToAdd, orgTypes);
        //     return Ok(courseToReturn);
        // }
    }
}
