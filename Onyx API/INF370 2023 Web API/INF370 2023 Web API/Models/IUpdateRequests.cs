using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IUpdateRequests
    {
        Task<object> GetUpdateRequestDetails();

        Task<object> GetUserUpdateRequestDetails(int id);

        Task<object> AcceptUpdateRequest(int id);

        Task<object> RejectUpdateRequest(int id);

        Task<object> AddUpdateRequest([FromBody] UpdateRequest updateRequest);
    }
}
