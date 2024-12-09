using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace INF370_2023_Web_API.Models
{
    public interface IFaq
    {
        Task<object> AddFAQ([FromBody] FAQ faq);

        Task<object> UpdateFAQ(int id, FAQ faq);

        Task<object> DeleteFAQ(int id);

        Task<object> GetFAQs();

        Task<object> OverrideFAQs(IEnumerable<FAQ> faqs);
    }
}
