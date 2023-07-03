using INF370_2023_Web_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INF370_2023_Web_API.Models
{
    public interface IPayments
    {
        Task<object> NewCart(CartDetails details);
        Task<object> NewPurchase(int id, dynamic cartObject);
    }
}
