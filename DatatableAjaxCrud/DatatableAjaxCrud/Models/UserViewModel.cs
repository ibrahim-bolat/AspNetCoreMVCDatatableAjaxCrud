using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace DatatableAjaxCrud.Models
{
    public class UserViewModel
    {
        
        [Display(Name = "Id")]
        [HiddenInput]
        public string Id { get; set; }
        
        [Required(ErrorMessage = "Lütfen adınızı boş geçmeyiniz...")]
        [Display(Name = "Ad")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Lütfen soyadınızı boş geçmeyiniz...")]
        [Display(Name = "Soyad")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Lütfen telefon numaranızı boş geçmeyiniz...")]
        [Display(Name = "Telefon")]
        public string Contact { get; set; }

        [Required(ErrorMessage = "Lütfen emaili boş geçmeyiniz...")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Lütfen uygun formatta e-posta adresi giriniz.")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Lütfen adresinizi boş geçmeyiniz...")]
        [Display(Name = "Adres")]
        public string Address { get; set; }
        

    }
}