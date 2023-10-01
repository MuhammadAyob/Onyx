using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IOTPTimer
    {
        Task<object> GetOTPTimer();

        Task<object> MaintainOTPTimer(int id, OTPTimer timer);

    }
}
