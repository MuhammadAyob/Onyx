using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class OTPTimerRepository:IOTPTimer
    {
        private readonly Entities db;

        public OTPTimerRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> GetOTPTimer()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var obj = await db.OTPTimers.FirstOrDefaultAsync();
            return obj;
        }

        public async Task<object> MaintainOTPTimer(int id, OTPTimer timer)
        {
            try
            {
                var otptimer = await db.OTPTimers.FindAsync(id);

                otptimer.MinutesUntilExpiry = timer.MinutesUntilExpiry;

                db.Entry(otptimer).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "OTP Timer updated" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error" };
            }
        }
    }
}