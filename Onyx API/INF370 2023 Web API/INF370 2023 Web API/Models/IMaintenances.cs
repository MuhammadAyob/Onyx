using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IMaintenances
    {
        Task<object> GetMaintenanceList();

        Task<object> GetUserMaintenanceList(int id);

        Task<object> UpdateMaintenanceRequest(int id, Maintenance maintenance);

        Task<object> ConfirmMaintenaceRequest(int id);

        Task<object> DeleteMaintenanceRequest(int id);

        Task<object> GetMaintenance(int id);

        Task<object> AddMaintenanceRequest([FromBody] Maintenance maintenance);
    }
}
