using INF370_2023_Web_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace INF370_2023_Web_API.Controllers
{
    public class InterviewsController : ApiController
    {
        private readonly IInterviews _interviewRepo;

        public InterviewsController(IInterviews interviewRepo)
        {
            this._interviewRepo = interviewRepo;
        }
    }
}
