using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IVat
    {
        Task<object> MaintainVATAmount(int id, VAT vat);
        Task<object> GetVATAmounts();
        Task<object> GetCurrentVAT();
        Task<object> DeleteVAT(int id);
        Task<object> AddVAT(VAT vat);
    }
}
