using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public class VATRepository: IVat
    {
        private readonly Entities db;

        public VATRepository(Entities database)
        {
            this.db = database;
        }

        public async Task<object> AddVAT(VAT vat)
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;

                var obj = await db.VATs.OrderByDescending(z => z.VatDate).FirstOrDefaultAsync();
                if(obj.VatAmount == vat.VatAmount)
                {
                    return new { Status = 500, Message = "VAT Amount cannot be the same as the current amount" };
                }

                vat.VatDate = DateTime.Now;
                var zz = Math.Round(vat.VatAmount, 2);
                vat.VatAmount = zz;
                db.VATs.Add(vat);
                await db.SaveChangesAsync();
                return new { Status = 200, Message = "VAT added" };
            }
            catch (Exception)
            {
                return new { Status = 501, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> DeleteVAT(int id)
        {
            try
            {
                var count = await db.VATs.CountAsync();

                if (count == 1)
                {
                    return new { Status = 404, Message = "VAT cannot be deleted, last remainin VAT Value" };
                }
                var vat = await db.VATs.FindAsync(id);
                db.VATs.Remove(vat);
                await db.SaveChangesAsync();

                return new { Status = 200, Message = "VAT deleted" };
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "FK violation" };
            }
        }

        public async Task<object> GetCurrentVAT()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.VATs.OrderByDescending(z=>z.VatDate).Select(x=> new 
                { 
                    VAT = x.VatAmount
                }).FirstOrDefaultAsync();
                return obj;
            }
            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };

            }
        }

        public async Task<object> GetVATAmounts()
        {
            try
            {
                db.Configuration.ProxyCreationEnabled = false;
                var obj = await db.VATs.OrderByDescending(z=>z.VatDate).ToListAsync();
                return obj;
            }

            catch (Exception)
            {
                return new { Status = 500, Message = "Internal server error, please try again" };
            }
        }

        public async Task<object> MaintainVATAmount(int id, VAT vat)
        {
            try
            {
                // get record above and below based on VAT date

                var currentRecord = await db.VATs.Where(x => x.VatID == id).FirstOrDefaultAsync();
                var previousRecord = await db.VATs.Where(z=>z.VatID < id).OrderByDescending(x=>x.VatID).FirstOrDefaultAsync();
                var nextRecord = await db.VATs.Where(z=>z.VatID>id).OrderBy(x=>x.VatID).FirstOrDefaultAsync();

                // compare amounts
                if ((previousRecord != null && (vat.VatAmount == previousRecord.VatAmount)) && (nextRecord != null && (vat.VatAmount == nextRecord.VatAmount)))
                {
                    return new { Status = 50, Message = "Value equal to next and previous" };
                }
                else if ((previousRecord != null && vat.VatAmount == previousRecord.VatAmount)
                    || (nextRecord != null && vat.VatAmount == nextRecord.VatAmount))
                {
                    if ((previousRecord != null && vat.VatAmount == previousRecord.VatAmount))
                    {
                        return new { Status = 150, Message = "Value equal to previous" };
                    }
                    else
                    {
                        return new { Status = 250, Message = "Value equal to next" };
                    }
                }
                else
                {
                    // update the VAT amount of the current record
                    var _vat = await db.VATs.FindAsync(id);
                    var zz = Math.Round(vat.VatAmount, 2);
                    vat.VatAmount = zz;
                    _vat.VatAmount = vat.VatAmount;
                    db.Entry(_vat).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    return new { Status = 200, Message = "VAT Amount Updated Successfully" };
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }



    }
}