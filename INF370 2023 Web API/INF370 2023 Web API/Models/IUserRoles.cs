using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IUserRoles
    {
        Task<object> GetUserRoles();

        Task<object> GetEmployeeUserRoles();

        Task<object> MaintainUserRole(int id, UserRole userRole);

        Task<object> validateUserRole(int id, UserRole userRole);

        Task<object> GetUserRoleID(int id);
    }
}
