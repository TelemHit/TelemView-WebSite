using System.Threading.Tasks;

namespace TelemView.API.EmailService
{
    //interface for EmailSender class
    public interface IEmailSender
    {
        //  void SendEmail(Message message);
         Task SendEmailAsync(Message message);
    }
}