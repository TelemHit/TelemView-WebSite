using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TelemView.API.Data;
using TelemView.API.Dtos;
using TelemView.API.EmailService;
using TelemView.API.Models;

//this controller responsible for all authorization process
//we use dotnet core Identity package to control this proccess
namespace TelemView.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        public AuthController(IConfiguration config
        , UserManager<User> userManager, SignInManager<User> signInManager,
        IMapper mapper, IEmailSender emailSender)
        {
            _config = config;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _emailSender = emailSender;
        }

        //register new user - only admin can register new user
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {

            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new RegistrationResponseDto { Errors = errors });
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(userToCreate);
            var param = new Dictionary<string, string>
            {
                {"token", token },
                {"email", userToCreate.Email }
            };
            var callback = QueryHelpers.AddQueryString(userForRegisterDto.ClientURI, param);
            var callbackString = "<div style='direction: rtl; text-align: center; padding:25px;'><h2>Telem View - אישור מייל</h2><br/><a style='background-color:#1ba098;color:white;padding:15px;border-radius:10px;text-decoration:none;font-size:12pt;' href='" + callback + "'>לחצו כאן לאישור המייל</a></div>";
            var message = new Message(new string[] { userForRegisterDto.Email }, "Telem View - אישור מייל", callbackString);
            await _emailSender.SendEmailAsync(message);

            return StatusCode(201);
        }

        //resend confirmation email
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("ResendConfirmation")]
        public async Task<IActionResult> ResendConfirmation(ResendEmailDto resendEmailDto)
        {
            var user = await _userManager.FindByEmailAsync(resendEmailDto.Email);
            if (user == null)
                return BadRequest("Invalid Email Confirmation Request");
            var isConfirm = await _userManager.IsEmailConfirmedAsync(user);
            if (isConfirm == true)
            {
                return BadRequest("Email Already Confirmed");
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var param = new Dictionary<string, string>
            {
                {"token", token },
                {"email", user.Email }
            };
            var callback = QueryHelpers.AddQueryString(resendEmailDto.ClientUri, param);
            var callbackString = "<div style='direction: rtl; text-align: center; padding:25px;'><h2>Telem View - אישור מייל</h2><br/><a style='background-color:#1ba098;color:white;padding:15px;border-radius:10px;text-decoration:none;font-size:12pt;' href='" + callback + "'>לחצו כאן לאישור המייל</a></div>";
            var message = new Message(new string[] { user.Email }, "Telem View - אישור מייל", callbackString);
            await _emailSender.SendEmailAsync(message);

            return StatusCode(201);
        }

        //email confirmation by the user 
        [HttpGet("EmailConfirmation")]
        public async Task<IActionResult> EmailConfirmation([FromQuery] string email, [FromQuery] string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest("Invalid Email Confirmation Request");
            var confirmResult = await _userManager.ConfirmEmailAsync(user, token);
            if (!confirmResult.Succeeded)
                return BadRequest("Invalid Email Confirmation Request");
            return Ok();
        }

        //login of user
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {

            var user = await _userManager.FindByEmailAsync(userForLoginDto.Email);
            if (user == null)
                return BadRequest("שם המשתמש או הסיסמה אינם נכונים");
            if (!await _userManager.CheckPasswordAsync(user, userForLoginDto.Password))
                return Unauthorized(new AuthResponseDto { ErrorMessage = "שם המשתמש או הסיסמה אינם נכונים" });
            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized(new AuthResponseDto { ErrorMessage = "כתובת המייל טרם אושרה, יש לבדוק את תיבת המייל" });


            var result = await _signInManager.CheckPasswordSignInAsync(user, userForLoginDto.Password, false);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    token = GenerateJwtToken(user).Result
                });
            }

            return Unauthorized();
        }

        //send email to change password
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid Request");
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string>
    {
        {"token", token },
        {"email", forgotPasswordDto.Email }
    };
            var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientURI, param);
            var callbackString = "<div style='direction: rtl; text-align: center; padding:25px;'><h2>Telem View - החלפת סיסמה</h2><br/><a style='background-color:#1ba098;color:white;padding:15px;border-radius:10px;text-decoration:none;font-size:12pt;' href='" + callback + "'>לחצו כאן להחלפת הסיסמה</a></div>";
            var message = new Message(new string[] { forgotPasswordDto.Email }, "TelemView - החלפת סיסמה", callbackString);
            await _emailSender.SendEmailAsync(message);
            return Ok();
        }

        //change password of user
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid Request");
            var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!resetPassResult.Succeeded)
            {
                var errors = resetPassResult.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
            return Ok();
        }

        //generate jwt Token for user who log in
        private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                 new Claim(ClaimTypes.Name, user.FirstName+' '+user.LastName)
             };

            var roles = await _userManager.GetRolesAsync(user);

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}