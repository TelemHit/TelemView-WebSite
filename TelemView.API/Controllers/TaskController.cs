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
    public class TaskController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        public TaskController(ITelemRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks(int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tasksFromRepo = await _repo.GetTasks();

            var tasksToReturn = _mapper.Map<IEnumerable<TaskDto>>(tasksFromRepo);

            return Ok(tasksToReturn);
        }

        [HttpGet("{id}", Name = "GetTask")]
        public async Task<IActionResult> GetTask(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var taskFromRepo = await _repo.GetTask(id);

            var taskToReturn = _mapper.Map<TaskDto>(taskFromRepo);

            return Ok(taskToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, int userId, TaskDto taskDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var taskFromRepo = await _repo.GetTask(id);
            taskDto.Id = taskFromRepo.Id;
            _mapper.Map(taskDto, taskFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating task {id} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var taskFromRepo = await _repo.GetTask(id);
            var taskToCheck = _mapper.Map<TaskDto>(taskFromRepo);
            if (taskToCheck.Counter != 0)
            {
                return BadRequest("Task has products");
            }
            _repo.Delete(taskFromRepo);

            if (await _repo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to delete the task");
        }

        [HttpPost]
        public async Task<IActionResult> AddTask(int userId, TaskDto taskDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var tasksFromRepo = await _repo.GetTasks();
            foreach (var task in tasksFromRepo)
            {
                if (task.Title.Trim() == taskDto.Title.Trim())
                    return BadRequest($"task {task.Title} already exists");
            }
            taskDto.Title=taskDto.Title.Trim();
            var newTask = _mapper.Map<Models.Task>(taskDto);
            _repo.Add(newTask);
            if (await _repo.SaveAll())
            {
                var taskToReturn = _mapper.Map<TaskDto>(newTask);
                return CreatedAtRoute("GetTask"
                    , new { userId = userId, id = newTask.Id }
                    , taskToReturn);
            }
            return BadRequest("Failed to add the tag");
        }
    }
}