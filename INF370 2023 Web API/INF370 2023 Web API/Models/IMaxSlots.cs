using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IMaxSlots
    {
        Task<object> GetMaxSlots();

        Task<object> MaintainSlots(int id, MaxSlotsPerDay slots);
    }
}
