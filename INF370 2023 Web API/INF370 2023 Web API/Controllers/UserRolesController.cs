using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class UserRolesController : ApiController
    {
        private readonly IUserRoles _userRolesRepo;

        public UserRolesController(IUserRoles userRolesRepo)
        {
            this._userRolesRepo = userRolesRepo;
        }

        [HttpGet]
        [Route("api/GetUserRoles")]
        public async Task<object> GetUserRoles()
        {
            return await _userRolesRepo.GetUserRoles();
        }

        [HttpGet]
        [Route("api/GetUserRoleID/{id}")]
        public async Task<object> GetUserRoleID(int id)
        {
            return await _userRolesRepo.GetUserRoleID(id);
        }

        [HttpPut]
        [Route("api/validateUserRole/{id}")]
        public async Task<object> validateUserRole(int id, UserRole userRole)
        {
            return await _userRolesRepo.validateUserRole(id, userRole);
        }

        [HttpPut]
        [Route("api/MaintainUserRole/{id}")]
        public async Task<object> MaintainUserRole(int id, UserRole userRole)
        {
            return await _userRolesRepo.MaintainUserRole(id, userRole);
        }

        [HttpGet]
        [Route("api/GetEmployeeUserRoles")]
        public async Task<object> GetEmployeeUserRoles()
        {
            return await _userRolesRepo.GetEmployeeUserRoles();
        }

    }
}
