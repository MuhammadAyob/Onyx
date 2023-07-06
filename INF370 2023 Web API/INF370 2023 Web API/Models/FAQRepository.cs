using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class FAQRepository:IFaq
    {
        private readonly Entities db;

        public FAQRepository(Entities database)
        {
            this.db = database;
        }

        private async Task<bool> FAQNameExists(string name)
        {
            var exists = await db.FAQs.Where(p => p.Question == name).FirstOrDefaultAsync();
            return exists != null;
        }

        public async Task<object> AddFAQ([FromBody] FAQ faq)
        {
            try
            {
                if(await FAQNameExists(faq.Question))
                {
                    return new { Status = 404, Message = "Question exists" };
                }

                db.FAQs.Add(faq);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "FAQ Added" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> UpdateFAQ(int id, FAQ faq)
        {
            try
            {
                var _faq = await db.FAQs.Where(x=>x.Question==faq.Question && x.ID != id).FirstOrDefaultAsync();
                
                if (_faq!=null)
                {

                    return new { Status = 404, Message = "Question name exists" };
                }

                else
                {
                    db.Entry(faq).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    return new { Status = 200, Message = "FAQ Added" };
                }

                
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteFAQ(int id)
        {
            try
            {
                FAQ faq = await db.FAQs.FindAsync(id);
                if (faq == null)
                {
                    return new { Status = 404, Message = "FAQ not found" };
                }

                db.FAQs.Remove(faq);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "FAQ removed!" };
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> GetFAQs()
        {
            try
            {
                return await db.FAQs.ToListAsync();
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> OverrideFAQs(IEnumerable<FAQ> faqs)
        {
            using (var transaction = db.Database.BeginTransaction())
            {
                try
                {
                    var count = await db.FAQs.CountAsync();
                    if (count > 0)
                    {
                        // Clear existing FAQs
                        db.FAQs.RemoveRange(db.FAQs);
                    }

                    // Add new FAQs from the faqs array
                    db.FAQs.AddRange(faqs);

                    await db.SaveChangesAsync();

                    // Commit the transaction if all operations succeed
                     transaction.Commit();
                    return new { Status = 200, Message = "FAQs added" };
                }
                catch (Exception ex)
                {
                    // Handle any database update errors
                     transaction.Rollback();
                    return ex.ToString();
                }
            }

           
        }

    }
}