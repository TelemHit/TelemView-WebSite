using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.Models;

//This controller requires Admin role and responsible for user roles edit and user delete
namespace TelemView.API.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ITelemRepository _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        public AdminController(ITelemRepository repo, IMapper mapper,
        UserManager<User> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _repo = repo;
        }

        //get users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();

            return Ok(users);
        }

        //edit user roles
        [HttpPost("editUser/{userName}")]
        public async Task<IActionResult> EditUser(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var userRoles = await _userManager.GetRolesAsync(user);
            var selectedRoles = roleEditDto.RoleNames;
            selectedRoles = selectedRoles ?? new string[] { };


            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove roles");

            return Ok(await _userManager.GetRolesAsync(user));

        }

        //delete user
        [HttpDelete("{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var userRoles = await _userManager.GetRolesAsync(user);

            if (userRoles.Contains("Admin"))
                return BadRequest("can not delete Admin");

            await _userManager.DeleteAsync(user);

            return Ok();
        }

    }
}

