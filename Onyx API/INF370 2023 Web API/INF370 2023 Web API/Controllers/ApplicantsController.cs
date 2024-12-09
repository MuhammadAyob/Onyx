using INF370_2023_Web_API.Models;
using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class ApplicantsController : ApiController
    {
        private readonly IApplicants _applicantRepo;

        public ApplicantsController(IApplicants applicantRepo)
        {
            this._applicantRepo = applicantRepo;
        }

        [HttpPost]
        [Route("api/newApplication")]
        public async Task<object> newApplication(ApplicantDetails applicant)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data" };
                }
                return await _applicantRepo.NewApplication(applicant);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
