using System;
using System.Linq;
using System.Threading.Tasks;
using DatatableAjaxCrud.Data;
using DatatableAjaxCrud.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace DatatableAjaxCrud.Controllers
{
    public class UserController : Controller
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetUsers()
        {
            try
            {
                var userData = (from tempuser in _context.Users select tempuser);
                var draw = Request.Form["draw"].FirstOrDefault();
                var start = Request.Form["start"].FirstOrDefault();
                var length = Request.Form["length"].FirstOrDefault();
                var sortColumn = Request
                    .Form["columns[" + Request.Form["order[0][column]"].FirstOrDefault() + "][name]"].FirstOrDefault();
                var sortColumnDirection = Request.Form["order[0][dir]"].FirstOrDefault();
                var searchValue = Request.Form["search[value]"].FirstOrDefault();
                int pageSize = length == "-1" ? userData.Count() : length != null ? Convert.ToInt32(length) : 0;
                int skip = start != null ? Convert.ToInt32(start) : 0;
                int recordsTotal = 0;
                if (!(string.IsNullOrEmpty(sortColumn) && string.IsNullOrEmpty(sortColumnDirection)))
                {
                    userData = userData.OrderBy(s => sortColumn + " " + sortColumnDirection);
                    Func<User, string> orderingFunction = (c => sortColumn == "First Name" ? c.FirstName :
                        sortColumn == "Last Name" ? c.LastName :
                        sortColumn == "Contact" ? c.Contact :
                        sortColumn == "Email" ? c.Email :
                        sortColumn == "Address" ? c.Address : c.FirstName);

                    if (sortColumnDirection == "desc")
                    {
                        userData = userData.OrderByDescending(orderingFunction).AsQueryable();
                    }
                    else
                    {
                        userData = userData.OrderBy(orderingFunction).AsQueryable();
                    }
                }

                if (!string.IsNullOrEmpty(searchValue))
                {
                    userData = userData.Where(m => m.FirstName.ToLower().Contains(searchValue.ToLower())
                                                   || m.LastName.ToLower().Contains(searchValue.ToLower())
                                                   || m.Contact.ToLower().Contains(searchValue.ToLower())
                                                   || m.Email.ToLower().Contains(searchValue.ToLower())
                                                   || m.Address.ToLower().Contains(searchValue.ToLower()));
                }

                recordsTotal = userData.Count();
                var data = userData.Skip(skip).Take(pageSize).ToList();
                var jsonData = new
                    { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data };
                return Ok(jsonData);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add(UserViewModel userViewModel)
        {
            int saveCount = 0;
            try
            {
                if (!ModelState.IsValid)
                {
                    return PartialView("_UserModalPartial", userViewModel);
                }

                User newUsers = new User
                {
                    FirstName = userViewModel.FirstName,
                    LastName = userViewModel.LastName,
                    Contact = userViewModel.Contact,
                    Email = userViewModel.Email,
                    Address = userViewModel.Address
                };
                await _context.Users.AddAsync(newUsers);
                saveCount = await _context.SaveChangesAsync();
                if (saveCount > 0)
                    return Json(new { success = true });
                return Json(new { success = false});
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetbyID(int ID)
        {
            try
            {
                User vUser = await _context.Users.FindAsync(ID);
                if (vUser != null)
                {
                    UserViewModel model = new UserViewModel
                    {
                        Id = vUser.Id.ToString(),
                        FirstName = vUser.FirstName,
                        LastName = vUser.LastName,
                        Contact = vUser.Contact,
                        Email = vUser.Email,
                        Address = vUser.Address
                    };
                    return Json(new { success = true, user = model });
                }

                return Json(new { success = false });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }


        [HttpPost]
        public async Task<IActionResult> Update(UserViewModel userViewModel)
        {
            int saveCount = 0;
            try
            {
                if (!ModelState.IsValid)
                {
                    return PartialView("_UserModalPartial", userViewModel);
                }

                User updatedUser = await _context.Users.FindAsync(Convert.ToInt32(userViewModel.Id));
                if (updatedUser != null)
                {
                    updatedUser.FirstName = userViewModel.FirstName;
                    updatedUser.LastName = userViewModel.LastName;
                    updatedUser.Contact = userViewModel.Contact;
                    updatedUser.Email = userViewModel.Email;
                    updatedUser.Address = userViewModel.Address;
                    _context.Users.Update(updatedUser);
                    saveCount = await _context.SaveChangesAsync();
                    if (saveCount > 0)
                        return Json(new { success = true });
                    return Json(new { success = false });
                }

                return Json(new { success = false });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int ID)
        {
            int saveCount = 0;
            try
            {
                User deletedUser = await _context.Users.FindAsync(ID);
                if (deletedUser != null)
                {
                    _context.Users.Remove(deletedUser);
                    saveCount = await _context.SaveChangesAsync();
                    if (saveCount > 0)
                        return Json(new { success = true });
                    return Json(new { success = false });
                }

                return Json(new { success = false });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest();
            }
        }
    }
}