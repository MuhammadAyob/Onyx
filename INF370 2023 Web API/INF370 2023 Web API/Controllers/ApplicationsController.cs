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
    public class ApplicationsController : ApiController
    {
        private readonly IApplications _applicationsRepo;

        public ApplicationsController(IApplications applicationsRepo)
        {
            this._applicationsRepo = applicationsRepo;
        }

        [HttpGet]
        [Route("api/GetApplications")]
        public async Task<object> GetApplications()
        {
            return await _applicationsRepo.GetApplications();
        }

        [HttpPut]
        [Route("api/RejectApplicant/{id}")]
        public async Task<object> RejectApplicant(int id)
        {
            return await _applicationsRepo.RejectApplicant(id);
        }

        [HttpPut]
        [Route("api/AddShortList/{id}")]
        public async Task<object> AddShortList(int id)
        {
            return await _applicationsRepo.AddShortList(id);
        }
    }
}
