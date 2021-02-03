using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace TelemView.API.Models
{
    public class User : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}