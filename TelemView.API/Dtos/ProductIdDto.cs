using System;
using System.Collections.Generic;
using TelemView.API.Models;

//dto only for product id - after initial creation of product we return id for update all other data
namespace TelemView.API.Dtos
{
    public class ProductIdDto
    {
        public int Id { get; set; }

    }
}