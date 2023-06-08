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
    public class ShortlistController : ApiController
    {
        private readonly IShortList _shortListRepo;

        public ShortlistController(IShortList shortListRepo)
        {
            this._shortListRepo = shortListRepo;
        }

        [HttpGet]
        [Route("api/GetShortlist")]
        public async Task<object> GetShortlist()
        {
            return await _shortListRepo.GetShortlist();
        }

        [HttpPut]
        [Route("api/RemoveFromShortlist/{id}")]
        public async Task<object> RemoveFromShortlist(int id)
        {
            return await _shortListRepo.RemoveFromShortlist(id);
        }

        [HttpPut]
        [Route("api/RejectShortlistedCandidate/{id}")]
        public async Task<object> RejectShortlistedCandidate(int id)
        {
            return await _shortListRepo.RejectShortlistedCandidate(id);
        }

        [HttpPut]
        [Route("api/AcceptShortlistedCandidate/{id}")]
        public async Task<object> AcceptShortlistedCandidate(int id)
        {
            return await _shortListRepo.AcceptShortlistedCandidate(id);
        }

        [HttpPut]
        [Route("api/OfferEmployment/{id}")]
        public async Task<object> OfferEmployment(int id)
        {
            return await _shortListRepo.OfferEmployment(id);
        }
    }
}
