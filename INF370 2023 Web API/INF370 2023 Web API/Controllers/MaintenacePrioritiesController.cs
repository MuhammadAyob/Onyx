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
    public class MaintenacePrioritiesController : ApiController
    {
        private readonly IMaintenancePriorities _maintenancePrioritiesRepo;

        public MaintenacePrioritiesController(IMaintenancePriorities maintenancePrioritiesRepo)
        {
            this._maintenancePrioritiesRepo = maintenancePrioritiesRepo;
        }

        [HttpGet]
        [Route("api/GetMaintenancePriorities")]
        public async Task<object> GetMaintenancePriorities()
        {
            return await _maintenancePrioritiesRepo.GetMaintenancePriorities();
        }

        [HttpGet]
        [Route("api/GetMaintenancePriorityID/{id}")]
        public async Task<object> GetMaintenacePriorityID(int id)
        {
            return await _maintenancePrioritiesRepo.GetMaintenancePriorityID(id);
        }

        [HttpGet]
        [Route("api/GetMaintenancePriority/{name}")]
        public async Task<object> GetMaintenacePriority(string MaintenancePriorityName)
        {
            return await _maintenancePrioritiesRepo.GetMaintenacePriority(MaintenancePriorityName);
        }

        [HttpPost]
        [Route("api/AddMaintenancePriority")]
        public async Task<object> AddMaintenancePriority([FromBody] MaintenancePriority maintenancePriority)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data post" };
                }

                return await _maintenancePrioritiesRepo.AddMaintenancePriority(maintenancePriority);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }

        }

        [HttpPut]
        [Route("api/UpdateMaintenancePriority/{id}")]
        public async Task<object> UpdateMaintenancePriority(int id, MaintenancePriority maintenancePriority)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data post" };
                }

                return await _maintenancePrioritiesRepo.UpdateMaintenancePriority(id, maintenancePriority);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteMaintenancePriority/{id}")]
        public async Task<object> DeleteMaintenancePriority(int id)
        {
            try
            {
                return await _maintenancePrioritiesRepo.DeleteMaintenancePriority(id);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}
