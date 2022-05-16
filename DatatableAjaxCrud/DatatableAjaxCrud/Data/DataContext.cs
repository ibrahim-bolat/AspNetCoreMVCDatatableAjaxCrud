using DatatableAjaxCrud.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatatableAjaxCrud.Data
{
    public class DataContext : DbContext
    {
        private readonly DbContextOptions<DataContext> _options;

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            _options = options;
        }

        public DbSet<User> Users { get; set; }
    }
}
