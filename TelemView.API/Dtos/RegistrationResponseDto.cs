using System.Collections.Generic;

//dto returns registration status
namespace TelemView.API.Dtos
{
    public class RegistrationResponseDto
    {
        public bool IsSuccessfulRegistration { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }
}