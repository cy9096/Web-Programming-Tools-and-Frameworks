var rentals = [
    {
        headline: "Beautiful House with Balcony",
        numSleeps: 2,
        numBedrooms: 1,
        numBathrooms: 1,
        pricePerNight: 169.99,
        city: "Toronto",
        province: "Ontario",
        imageUrls: "../images/1.jpg",
        featuredRental: true
    },
    {
        headline: "Apartment in the Heart of Downtown",
        numSleeps: 2,
        numBedrooms: 1,
        numBathrooms: 1,
        pricePerNight: 199.99,
        city: "Toronto",
        province: "Ontario",
        imageUrls: "../images/2.jpg",
        featuredRental: false
    },
    {
        headline: "King Size bed in lakefront cottage",
        numSleeps: 2,
        numBedrooms: 1,
        numBathrooms: 1,
        pricePerNight: 169.99,
        city: "Barrie",
        province: "Ontario",
        imageUrls: "../images/3.jpg",
        featuredRental: true
    },
    {
        headline: "Modern condo in the downtown",
        numSleeps: 2,
        numBedrooms: 1,
        numBathrooms: 1,
        pricePerNight: 169.99,
        city: "Toronto",
        province: "Ontario",
        imageUrls: "../images/4.jpg",
        featuredRental: false
    },
    {
        headline: "City view condo",
        numSleeps: 2,
        numBedrooms: 1,
        numBathrooms: 1,
        pricePerNight: 219.99,
        city: "Toronto",
        province: "Ontario",
        imageUrls: "../images/5.jpg",
        featuredRental: true
    },
    {
        headline: " Modern bachelor apartment",
        numSleeps: 2,
        numBedrooms: 1,
        numBathrooms: 1,
        pricePerNight: 199.99,
        city: "Barrie",
        province: "Ontario",
        imageUrls: "../images/6.jpg",
        featuredRental: false
    },

]

module.exports.getFeaturedRentals = function () {
    let filtered = [];

    for (let i = 0; i < rentals.length; i++) {
        if (rentals[i].featuredRental) {
            filtered.push(rentals[i]);
        }
    }

    return filtered;
}


module.exports.getRentalsByCityAndProvince = function() {
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
  // module.exports.getRentalsByCityAndProvince = function () {
//     var result = [];
//     for (var i = 0; i < rentals.length; i++) {
//         var cityProvince = rentals[i].city + ", " + rentals[i].province;
//         var existing = result.find(r => r.cityProvince == cityProvince);
//         if (existing) {
//             existing.rentals.push(rentals[i]);
//         } else {
//             result.push({ cityProvince: cityProvince, rentals: [rentals[i]] });
//         }

//         return result;
//     }
// }