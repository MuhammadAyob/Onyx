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
    public class RatingsController : ApiController
    {
        private readonly IRatings _ratingsRepo;

        public RatingsController(IRatings ratingsRepo)
        {
            this._ratingsRepo = ratingsRepo;
        }

        [HttpPost]
        [Route("api/AddRating")]
        public async Task<object> AddRating(CourseRating rating)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Data invalid" };
                }

                return await _ratingsRepo.AddRating(rating);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
           
        }

        [HttpPut]
        [Route("api/UpdateRating/{id}")]
        public async Task<object>UpdateRating(int id, CourseReview rating)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return new { Status = 404, Message = "Data invalid" };
                }

                return await _ratingsRepo.UpdateRating(id,rating);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpDelete]
        [Route("api/DeleteRating/{id}")]
        public async Task<object>DeleteRating(int id)
        {
            return await _ratingsRepo.DeleteRating(id);
        }

        [HttpGet]
        [Route("api/GetCoursesToRate/{id}")]
        public async Task<object> GetCoursesToRate(int id)
        {
            return await _ratingsRepo.GetCoursesToRate(id);
        }
    }
}
