using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class MaintenancePrioritiesRepository: IMaintenancePriorities
    {
        private readonly Entities db;

        public MaintenancePrioritiesRepository(Entities database)
        {
            this.db = database;
        }

        private async Task<bool> MaintenancePriorityExists(int id)
        {
            return await db.MaintenancePriorities.CountAsync(e => e.MaintenancePriorityID == id) > 0;
        }

        private async Task<bool> MaintenancePriorityNameExists(string name)
        {
            var exists = await db.MaintenancePriorities.Where(p => p.Priority == name).FirstOrDefaultAsync();
            return exists != null;
        }

        public async Task<object> GetMaintenancePriorities()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.MaintenancePriorities.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetMaintenancePriorityID(int id)
        {
            try
            {
                MaintenancePriority maintenancePriority = await db.MaintenancePriorities.Where(s => s.MaintenancePriorityID == id).FirstOrDefaultAsync();
                return maintenancePriority;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetMaintenacePriority(string MaintenancePriorityName)
        {
            try
            {
                MaintenancePriority maintenancePriority = await db.MaintenancePriorities
                .Where(x => x.Priority == MaintenancePriorityName)
                .FirstOrDefaultAsync();

                if (maintenancePriority == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return maintenancePriority;

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> AddMaintenancePriority([FromBody] MaintenancePriority maintenancePriority)
        {
            try
            {
                //check exists

                if (await MaintenancePriorityNameExists(maintenancePriority.Priority))
                {
                    return new { Status = 400, Message = "Priority exists" };
                }

                db.MaintenancePriorities.Add(maintenancePriority);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Maintenance Priority Added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateMaintenancePriority(int id, MaintenancePriority maintenancePriority)
        {
            try
            {
                var _prio = await db.MaintenancePriorities.Where(x => x.Priority == maintenancePriority.Priority && x.MaintenancePriorityID != id).FirstOrDefaultAsync();

                if (_prio != null)
                {
                   
                    return new { Status = 404, Message = "Priority exists" };
                }

                else
                {
                    db.Entry(maintenancePriority).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                    return new { Status = 200, Message = "Maintenance Priority updated" };
                }
                
              
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteMaintenancePriority(int id)
        {
            try
            {
                MaintenancePriority maintenancePriority = await db.MaintenancePriorities.FindAsync(id);
                if (maintenancePriority == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                db.MaintenancePriorities.Remove(maintenancePriority);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "Priority removed" };

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}