using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    }
}
