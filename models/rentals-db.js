var rentals = [
  {
    //id: 1,
    headline: "Beautiful House with Balcony",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 169.99,
    city: "Toronto",
    province: "Ontario",
    imageUrl: "../images/1.jpg",
    featuredRental: true
  },
  {
   // id: 2,
    headline: "Apartment in the Heart of Downtown",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 199.99,
    city: "Toronto",
    province: "Ontario",
    imageUrl: "../images/2.jpg",
    featuredRental: false
  },
  {
    //id: 3,
    headline: "King Size bed in lakefront cottage",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 169.99,
    city: "Barrie",
    province: "Ontario",
    imageUrl: "../images/3.jpg",
    featuredRental: true
  },
  {
    //id: 4,
    headline: "Modern condo in the downtown",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 169.99,
    city: "Toronto",
    province: "Ontario",
    imageUrl: "../images/4.jpg",
    featuredRental: True
  },
  {
    //id: 5,
    headline: "City view condo",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 219.99,
    city: "Toronto",
    province: "Ontario",
    imageUrl: "../images/5.jpg",
    featuredRental: False
  },
  {
   // id: 6,
    headline: " Modern bachelor apartment",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 199.99,
    city: "Barrie",
    province: "Ontario",
    imageUrl: "../images/6.jpg",
    featuredRental: false
  },

];



module.exports.getFeaturedRentals = function () {
  let filtered = [];

  for (let i = 0; i < rentals.length; i++) {
    if (rentals[i].featuredRental) {
      filtered.push(rentals[i]);
    }
  }

  return filtered;
}


module.exports.getRentalsByCityAndProvince = function () {
  var rentalsByCityAndProvince = [];

  // Group rentals by city and province
  rentals.forEach(rental => {
    var cityProvince = `${rental.city}, ${rental.province}`;
    var cityProvinceIndex = rentalsByCityAndProvince.findIndex(item => item.cityProvince === cityProvince);

    if (cityProvinceIndex === -1) {
      // Add new cityProvince to the array
      rentalsByCityAndProvince.push({
        cityProvince: cityProvince,
        rentals: [rental]
      });
    } else {
      // Add rental to existing cityProvince
      rentalsByCityAndProvince[cityProvinceIndex].rentals.push(rental);
    }
  });

  return rentalsByCityAndProvince;
}

module.exports.listRentalsByCityAndProvince = function (rentalArr) {
  var rentalsByCityAndProvince = [];

  // Group rentals by city and province
  rentalArr.forEach(rental => {
    var cityProvince = `${rental.city}, ${rental.province}`;
    var cityProvinceIndex = rentalsByCityAndProvince.findIndex(item => item.cityProvince === cityProvince);

    if (cityProvinceIndex === -1) {
      // Add new cityProvince to the array
      rentalsByCityAndProvince.push({
        cityProvince: cityProvince,
        rentals: [rental]
      });
    } else {
      // Add rental to existing cityProvince
      rentalsByCityAndProvince[cityProvinceIndex].rentals.push(rental);
    }
  });

  return rentalsByCityAndProvince;
}



module.exports.getAllRentals = function () {
  return rentals;
}

const cart = null;
module.exports = class Cart{
  static save(item) {
    if (cart) {
       
    } else {
      cart = { rentals: [], totalPrice: 0 };
      item.qty = 1;
      cart.rentals.push(item);
      cart.totalPrice += item.pricePerNight;

    }
  }
  static getCart() {
    return cart;
  }
  
 }