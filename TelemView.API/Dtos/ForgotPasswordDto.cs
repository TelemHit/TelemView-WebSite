
using System.ComponentModel.DataAnnotations;
//dto for email and uri from user who forgot password
namespace TelemView.API.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string ClientURI { get; set; }
    }
}