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
    public class JobOppController : ApiController
    {
        private readonly IJobOpp _jobRepo;

        public JobOppController(IJobOpp jobRepo)
        {
            this._jobRepo = jobRepo;
        }

        [HttpGet]
        [Route("api/GetJobOpps")]
        public async Task<object> GetJobOpps()
        {
            return await _jobRepo.GetJobOpps();
        }

        [HttpGet]
        [Route("api/GetActiveJobs")]
        public async Task<object> GetActiveJobs()
        {
            return await _jobRepo.GetActiveJobs();
        }

        [HttpGet]
        [Route("api/GetWorkTypes")]
        public async Task<object> GetWorkTypes()
        {
            return await _jobRepo.GetWorkTypes();
        }

        [HttpGet]
        [Route("api/GetStatuses")]
        public async Task<object> GetStatuses()
        {
            return await _jobRepo.GetStatuses();
        }

        [HttpGet]
        [Route("api/ExpiredJobs")]
        public async Task<object> ExpiredJobs()
        {
            return await _jobRepo.ExpiredJobOpportunity();
        }

        [HttpPost]
        [Route("api/AddJob")]
        public async Task<object>AddJob(JobOpportunity job)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data format" };
                }

                return await _jobRepo.AddJobOpp(job);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPut]
        [Route("api/UpdateJob/{id}")]
        public async Task<object>UpdateJob(int id, JobOpportunity job)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data format" };
                }

                return await _jobRepo.UpdateJobOpp(id, job);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPut]
        [Route("api/DeleteJob/{id}")]
        public async Task<object>DeleteJob(int id)
        {
            return await _jobRepo.DeleteJobOpp(id);
        }
    }
}
