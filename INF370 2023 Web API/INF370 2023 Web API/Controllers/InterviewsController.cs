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
    public class InterviewsController : ApiController
    {
        private readonly IInterviews _interviewRepo;

        public InterviewsController(IInterviews interviewRepo)
        {
            this._interviewRepo = interviewRepo;
        }

        [HttpGet]
        [Route("api/GetPending")]
        public async Task<object> GetPending()
        {
            return await _interviewRepo.GetPending();
        }

        [HttpPost]
        [Route("api/AddSlot")]
        public async Task<object> AddInterviewSlot(InterviewDetails interview)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data format" };
                }

                return await _interviewRepo.AddInterviewSlot(interview);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPut]
        [Route("api/UpdateSlot/{id}")]
        public async Task<object> UpdateInterviewSlot(int id, InterviewDetails interview)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Invalid data format" };
                }

                return await _interviewRepo.UpdateInterviewSlot(id, interview);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPut]
        [Route("api/DeleteSlot/{id}")]
        public async Task<object> DeleteInterviewSlot(int id)
        {
            return await _interviewRepo.DeleteInterviewSlot(id);
        }

        [HttpGet]
        [Route("api/GetSlots")]
        public async Task<object> GetInterviewSlots()
        {
            return await _interviewRepo.GetInterviewSlots();
        }
    }
}
