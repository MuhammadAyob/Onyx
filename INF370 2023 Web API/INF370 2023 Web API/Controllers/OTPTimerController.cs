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
    public class OTPTimerController : ApiController
    {
        private readonly IOTPTimer _otpTimerRepo;

        public OTPTimerController(IOTPTimer otpTimerRepo)
        {
            this._otpTimerRepo = otpTimerRepo;
        }

        [HttpGet]
        [Route("api/GetOTPTimer")]
        public async Task<object> GetOTPTimer()
        {
            return await _otpTimerRepo.GetOTPTimer();
        }

        [HttpPut]
        [Route("api/MaintainOTPTimer/{id}")]
        public async Task<object> MaintainOTPTimer(int id, OTPTimer timer)
        {
            return await _otpTimerRepo.MaintainOTPTimer(id, timer);
        }
    }
}
