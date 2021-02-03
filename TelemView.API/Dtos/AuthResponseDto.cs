//dto for login data
namespace TelemView.API.Dtos
{
    public class AuthResponseDto
    {
    public bool IsAuthSuccessful { get; set; }
    public string ErrorMessage { get; set; }
    public string Token { get; set; }

    }
}