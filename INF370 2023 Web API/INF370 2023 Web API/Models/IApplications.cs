using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IApplications
    {
        Task<object> GetApplications();
        Task<object> RejectApplicant(int id);
        Task<object> AddShortList(int id);
    }
}
