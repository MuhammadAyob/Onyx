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
    public class MaxSlotsController : ApiController
    {
        private readonly IMaxSlots _slotsRepo;

        public MaxSlotsController(IMaxSlots slotsRepo)
        {
            this._slotsRepo = slotsRepo;
        }

        [HttpGet]
        [Route("api/GetMaxSlots")]
        public async Task<object> GetMaxSlots()
        {
            return await _slotsRepo.GetMaxSlots();
        }

        [HttpPut]
        [Route("api/MaintainSlots/{id}")]
        public async Task<object> MaintainSlots(int id, MaxSlotsPerDay slots)
        {
            return await _slotsRepo.MaintainSlots(id, slots);
        }
    }
}
