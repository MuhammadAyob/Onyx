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
    public class UpdateRequestsController : ApiController
    {
        public readonly IUpdateRequests _updateRequestsRepo;

        public UpdateRequestsController(IUpdateRequests updateRequestsRepo)
        {
            this._updateRequestsRepo = updateRequestsRepo;
        }

        [HttpGet]
        [Route("api/GetUpdateRequestDetails")]
        public async Task<object> GetUpdateRequestDetails()
        {
            return await _updateRequestsRepo.GetUpdateRequestDetails();
        }

        [HttpPut]
        [Route("api/AcceptUpdateRequest/{id}")]
        public async Task<object> AcceptUpdateRequest(int id, UpdateRequest updateRequest)
        {
            return await _updateRequestsRepo.AcceptUpdateRequest(id, updateRequest);
        }

        [HttpPut]
        [Route("api/RejectUpdateRequest/{id}")]
        public async Task<object> RejectUpdateRequest(int id, UpdateRequest updateRequest)
        {
            return await _updateRequestsRepo.RejectUpdateRequest(id, updateRequest);
        }

        [HttpPost]
        [Route("api/AddUpdateRequest")]
        public async Task<object> AddUpdateRequest([FromBody]UpdateRequest updateRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data entry" };
                }

                return await _updateRequestsRepo.AddUpdateRequest(updateRequest);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpGet]
        [Route("api/GetUserUpdateRequestDetails/{id}")]
        public async Task<object> GetUserUpdateRequestDetails(int id)
        {
            return await _updateRequestsRepo.GetUserUpdateRequestDetails(id);
        }
    }
}
