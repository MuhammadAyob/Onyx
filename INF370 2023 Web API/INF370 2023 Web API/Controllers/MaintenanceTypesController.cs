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
    public class MaintenanceTypesController : ApiController
    {
        private readonly IMaintenanceTypes _maintenaceTypesRepo;

        public MaintenanceTypesController(IMaintenanceTypes maintenanceTypesRepo)
        {
            this._maintenaceTypesRepo = maintenanceTypesRepo;
        }

        [HttpGet]
        [Route("api/GetMaintenanceTypes")]
        public async Task<object> GetMaintenanceTypes()
        {
            return await _maintenaceTypesRepo.GetMaintenanceTypes();
        }

        [HttpGet]
        [Route("api/GetMaintenanceTypeID/{id}")]
        public async Task<object> GetMaintenaceTypeID(int id)
        {
            return await _maintenaceTypesRepo.GetMaintenanceTypeID(id);
        }

        [HttpGet]
        [Route("api/GetMaintenanceType/{name}")]
        public async Task<object> GetMaintenaceType(string MaintenanceTypeName)
        {
            return await _maintenaceTypesRepo.GetMaintenaceType(MaintenanceTypeName);
        }

        [HttpPost]
        [Route("api/AddMaintenanceType")]
        public async Task<object> AddMaintenanceType([FromBody] MaintenanceType maintenanceType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data post" };
                }

                return await _maintenaceTypesRepo.AddMaintenanceType(maintenanceType);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }

        }

        [HttpPut]
        [Route("api/UpdateMaintenanceType/{id}")]
        public async Task<object> UpdateMaintenanceType(int id, MaintenanceType maintenanceType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data post" };
                }

                return await _maintenaceTypesRepo.UpdateMaintenanceType(id, maintenanceType);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteMaintenanceType/{id}")]
        public async Task<object> DeleteMaintenanceType(int id)
        {
            try
            {
                return await _maintenaceTypesRepo.DeleteMaintenanceType(id);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        ///test 1/////////
    }
}
