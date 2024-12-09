using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace INF370_2023_Web_API.Models
{
    public class TermsRepository: ITerms
    {
        private readonly Entities db;

        public TermsRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddTerms(TermsAndCondition Terms)
        {
            try
            {
                db.TermsAndConditions.Add(Terms);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "T&Cs added" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetTerms()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.TermsAndConditions.FirstOrDefaultAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainTerms(int id, TermsAndCondition tc)
        {
            try
            {
                var _tc = await db.TermsAndConditions.FindAsync(id);

                _tc.TCFile = tc.TCFile;
                db.Entry(_tc).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "T&Cs updated" };

            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }
    }
}