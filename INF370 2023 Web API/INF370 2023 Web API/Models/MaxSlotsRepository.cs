using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class MaxSlotsRepository : IMaxSlots
    {
        private readonly Entities db;

        public MaxSlotsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> GetMaxSlots()
        {
            db.Configuration.ProxyCreationEnabled = false;
            var obj = await db.MaxSlotsPerDays.FirstOrDefaultAsync();
            return obj;
        }

        public async Task<object> MaintainSlots(int id, MaxSlotsPerDay slots)
        {
            try
            {
                var maxslots = await db.MaxSlotsPerDays.FindAsync(id);

                maxslots.NumberOfSlots = slots.NumberOfSlots;

                db.Entry(maxslots).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Max slots updated" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error" };
            }
        }
    }
}