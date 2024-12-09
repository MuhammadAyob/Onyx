using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IMaintenanceTypes
    {
        Task<object> GetMaintenanceTypes();

        Task<object> GetMaintenanceTypeID(int id);

        Task<object> GetMaintenaceType(string MaintenanceTypeName);

        Task<object> AddMaintenanceType([FromBody] MaintenanceType maintenanceType);

        Task<object> UpdateMaintenanceType(int id, MaintenanceType maintenanceType);

        Task<object> DeleteMaintenanceType(int id);
    }
}
