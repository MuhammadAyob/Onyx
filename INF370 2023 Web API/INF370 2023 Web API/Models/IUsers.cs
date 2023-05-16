using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
   public interface IUsers
    {
        Task<object> NewStudent([FromBody] StudentViewModel student);

        Task<object> NewEmployee([FromBody] EmployeeViewModel employee);

        Task<object> Login([FromBody] User User);

        Task<object> Logout(string token);

        Task<object> DeactivateUser(int id);

        Task<object> ReactivateUser(int id);

        Task<object> GetDisabledUsers();

        Task<object> validateUser(string token);

        Task<object> PostAuditLog(AuditLog audit);

        Task<object> getUserName(int id);

        Task<object> UpdateEmployeeProfile(int id,Employee employee);

        Task<object> UpdateStudentProfile(int id, Student student);

        Task<object> GetUsers();
        
        Task<object> ForgotPassword([FromBody] User user);

        Task<object> NewPassword([FromBody] User usr);
    }
}
