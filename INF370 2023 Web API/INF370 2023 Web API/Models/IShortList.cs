using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IShortList
    {
        Task<object> GetShortlist();
        Task<object> RemoveFromShortlist(int id);
        Task<object> RejectShortlistedCandidate(int id);
        Task<object> AcceptShortlistedCandidate(int id);
        Task<object> OfferEmployment(int id);
    }
}
