using System.ComponentModel.DataAnnotations;

//dto for new password data
namespace TelemView.API.Dtos
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        [Compare("Password", ErrorMessage = "הסיסמאות לא תואמות. יש להזין את הסיסמה שנית.")]
        public string ConfirmPassword { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }
}