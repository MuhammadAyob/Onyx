using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IRatings
    {
        Task<object> AddRating(CourseRating rating);
        Task<object> UpdateRating(int id, CourseReview rating);
        Task<object> DeleteRating(int id);
        Task<object> GetCoursesToRate(int id);
    }
}
