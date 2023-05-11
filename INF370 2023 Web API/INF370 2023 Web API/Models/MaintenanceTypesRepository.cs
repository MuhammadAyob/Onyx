using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class MaintenanceTypesRepository : IMaintenanceTypes
    {
        private readonly Entities db;

        public MaintenanceTypesRepository(Entities database)
        {
            this.db = database;
        }

        // validation checks // / / /  /

        private async Task <bool> MaintenanceTypeExists(int id)
        {
            return await db.MaintenanceTypes.CountAsync(e => e.MaintenanceTypeID == id) > 0;
        }

        private async Task<bool> MaintenanceTypeNameExists(string name)
        {
            var exists = await db.MaintenanceTypes.Where(p => p.Type == name).FirstOrDefaultAsync();
            return exists != null;
        }

        // end / / / // /

        public async Task<object> GetMaintenanceTypes()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.MaintenanceTypes.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetMaintenanceTypeID(int id)
        {
            try
            {
                MaintenanceType maintenanceType = await db.MaintenanceTypes.Where(s => s.MaintenanceTypeID == id).FirstOrDefaultAsync();
                return maintenanceType;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetMaintenaceType(string MaintenanceTypeName)
        {
            try
            {
                MaintenanceType maintenanceType = await db.MaintenanceTypes
                .Where(x => x.Type == MaintenanceTypeName)
                .FirstOrDefaultAsync();

                if (maintenanceType == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                return maintenanceType;

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> AddMaintenanceType([FromBody] MaintenanceType maintenanceType)
        {
            try
            {
                //check exists
                if (await MaintenanceTypeNameExists(maintenanceType.Type))
                {
                    return new { Status = 400, Message = "Type exists" };
                }

                db.MaintenanceTypes.Add(maintenanceType);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Maintenance Type Added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateMaintenanceType(int id, MaintenanceType maintenanceType)
        {
            try
            {
                //check exists
                var _type = await db.MaintenanceTypes.Where(x => x.Type == maintenanceType.Type && x.MaintenanceTypeID != id).FirstOrDefaultAsync();

                if (_type != null)
                {
                    return new { Status = 401, Message = "Maintenance Type exists" };
                }

                db.Entry(maintenanceType).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "Maintenance Type Added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteMaintenanceType(int id)
        {
            try
            {
                MaintenanceType maintenanceType = await db.MaintenanceTypes.FindAsync(id);
                if (maintenanceType == null)
                {
                    return new { Status = 404, Message = "Not found" };
                }

                db.MaintenanceTypes.Remove(maintenanceType);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "MaintenanceType removed" };

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}