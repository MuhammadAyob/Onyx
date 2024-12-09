using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IInterviews
    {
        Task<object> GetPending();
        Task<object> AddInterviewSlot(InterviewDetails interview);
        Task<object> UpdateInterviewSlot(int id, InterviewDetails interview);
        Task<object> DeleteInterviewSlot(int id);
        Task<object> GetInterviewSlots();
        Task<object> ScanQRCode(int id);
    }
}
