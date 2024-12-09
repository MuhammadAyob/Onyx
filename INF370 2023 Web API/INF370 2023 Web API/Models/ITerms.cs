using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface ITerms
    {
        Task<object> MaintainTerms(int id, TermsAndCondition tc);

        Task<object> GetTerms();

        Task<object> AddTerms(TermsAndCondition Terms);
    }
}
