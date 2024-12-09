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
    public class TermsAndConditionsController : ApiController
    {
        private readonly ITerms _termsRepo;
        
        public TermsAndConditionsController(ITerms termsRepo)
        {
            this._termsRepo = termsRepo;
        }


        [HttpPost]
        [Route("api/AddTerms")]
        public async Task<object> AddTerms(TermsAndCondition terms)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                return await _termsRepo.AddTerms(terms);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
           
        }


        [HttpGet]
        [Route("api/GetTerms")]
        public async Task<object> GetTerms()
        {
            return await _termsRepo.GetTerms();
        }

        [HttpPut]
        [Route("api/UpdateTerms/{id}")]
        public async Task<object> MaintainTerms(int id, TermsAndCondition tc)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                return await _termsRepo.MaintainTerms(id, tc);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}
