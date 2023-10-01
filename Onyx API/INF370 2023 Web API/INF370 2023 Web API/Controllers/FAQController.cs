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
    public class FAQController : ApiController
    {
        private readonly IFaq _faqRepo;

        public FAQController(IFaq faqRepo)
        {
            this._faqRepo = faqRepo;
        }

        [HttpPost]
        [Route("api/AddFAQ")]
        public async Task<object> AddFAQ([FromBody] FAQ faq)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 400, Message = "Invalid data" };
                }

                return await _faqRepo.AddFAQ(faq);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpPut]
        [Route("api/UpdateFAQ/{id}")]
        public async Task<object> UpdateFAQ(int id, FAQ faq)
        {
            try
            {

                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                return await _faqRepo.UpdateFAQ(id,faq);
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        [HttpDelete]
        [Route("api/DeleteFAQ/{id}")]
        public async Task<object> DeleteFAQ(int id)
        {
            return await _faqRepo.DeleteFAQ(id);
        }

        [HttpGet]
        [Route("api/GetFAQs")]
        public async Task<object> GetFAQs()
        {
            return await _faqRepo.GetFAQs();
        }

        [HttpPost]
        [Route("api/OverrideFAQs")]
        public async Task<object> OverrideFAQs(IEnumerable<FAQ> faqs)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }

                return await _faqRepo.OverrideFAQs(faqs);
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error. Please try again" };
            }
        }
    }
}
