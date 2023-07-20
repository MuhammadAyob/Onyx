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
    public class MaintenancesController : ApiController
    {
        private readonly IMaintenances _maintenanceRepo;

        public MaintenancesController(IMaintenances maintenanceRepo)
        {
            this._maintenanceRepo = maintenanceRepo;
        }

        [HttpGet]
        [Route("api/GetMaintenanceList")]
        public async Task<object> GetMaintenanceList()
        {
            return await _maintenanceRepo.GetMaintenanceList();
        }

        [HttpGet]
        [Route("api/GetUserMaintenanceList/{id}")]
        public async Task<object> GetUserMaintenanceList(int id)
        {
            return await _maintenanceRepo.GetUserMaintenanceList(id);
        }

        [HttpPut]
        [Route("api/UpdateMaintenanceRequest/{id}")]
        public async Task<object> UpdateMaintenanceRequest(int id, Maintenance maintenance)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                return await _maintenanceRepo.UpdateMaintenanceRequest(id, maintenance);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/ConfirmMaintenanceRequest/{id}")]
        public async Task<object> ConfirmMaintenaceRequest(int id)
        {
            return await _maintenanceRepo.ConfirmMaintenaceRequest(id);
        }

        [HttpPut]
        [Route("api/DeleteMaintenaceRequest/{id}")]
        public async Task<object> DeleteMaintenanceRequest(int id)
        {
            return await _maintenanceRepo.DeleteMaintenanceRequest(id);
        }


        [HttpGet]
        [Route("api/GetMaintenance/{id}")]
        public async Task<object> GetMaintenance(int id)
        {
            return await _maintenanceRepo.GetMaintenance(id);
        }

        [HttpPost]
        [Route("api/AddMaintenanceRequest")]
        public async Task<object> AddMaintenanceRequest([FromBody] Maintenance maintenance)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                if (maintenance.MaintenanceTypeID == 0 || maintenance.MaintenancePriorityID == 0)
                {
                    return new { Status = 600, Message = "Missing dropdowns" };
                }

                return await _maintenanceRepo.AddMaintenanceRequest(maintenance);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

    }
}
