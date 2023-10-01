using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IMaintenancePriorities
    {
        Task<object> GetMaintenancePriorities();

        Task<object> GetMaintenancePriorityID(int id);

        Task<object> GetMaintenacePriority(string MaintenancePriorityName);

        Task<object> AddMaintenancePriority([FromBody] MaintenancePriority maintenancePriority);

        Task<object> UpdateMaintenancePriority(int id, MaintenancePriority maintenancePriority);

        Task<object> DeleteMaintenancePriority(int id);
    }
}
