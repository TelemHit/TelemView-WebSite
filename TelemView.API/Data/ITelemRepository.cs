using System.Collections.Generic;
using System.Threading.Tasks;
using TelemView.API.Helpers;
using TelemView.API.Models;

namespace TelemView.API.Data
{
    public interface ITelemRepository
    {
        Task<IEnumerable<Product>> GetProducts(ProductParams productParams);
        Task<Product> GetProduct(int id);
        Task<DataForHome> GetDataForHome();
    }
}