using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class UserRolesRepository: IUserRoles
    {
        private readonly Entities db;
        public UserRolesRepository(Entities database)
        {
            this.db = database;
        }

        private async Task<bool> UserRoleNameExists(string name)
        {
            var exists = await db.UserRoles.Where(p => p.RoleName == name).FirstOrDefaultAsync();
            return exists != null;
        }

        private async Task <bool> maintainCheck(int id, string name)
        {
            UserRole role = await db.UserRoles.FindAsync(id);

            if (role.RoleName == name)
            {
                return true;
            }

            else
            {
                return false;
            }
        }



        public async Task<object> GetEmployeeUserRoles()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                return await db.UserRoles.Where(x => x.UserRoleID != 3).ToListAsync();
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetUserRoles()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj= await db.UserRoles.ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainUserRole(int id, UserRole userRole)
        {
            try
            {
                var UR = await db.UserRoles.Where(x => x.RoleName == userRole.RoleName && x.UserRoleID != id).FirstOrDefaultAsync();

                if (UR != null)
                {
                    return new { Status = 404, Message = "User Role Name exists" };
                }



                var existingEntity = await db.UserRoles.FindAsync(id);
                    db.Entry(existingEntity).CurrentValues.SetValues(userRole); 
                    await db.SaveChangesAsync();
                    return new { Status = 200, Message = "User Role updated" };
                
            }

            catch (Exception e)
            {
                return e.ToString();
            }
        }

        public async Task<object> validateUserRole(int id, UserRole userRole)
        {
            if (await UserRoleNameExists(userRole.RoleName))
            {
                if (await maintainCheck(id, userRole.RoleName) == true)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }

        public async Task<object> GetUserRoleID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return await db.UserRoles.Where(x=>x.UserRoleID==id).FirstOrDefaultAsync();
        }
    }
}