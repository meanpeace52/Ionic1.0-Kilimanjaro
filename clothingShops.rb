require 'firebase'
require 'faker'
base_uri = 'https://kilimanjaro-80035.firebaseio.com/'
firebase = Firebase::Client.new(base_uri)


def random_image()
  a=["https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2Fu-street-clothing-stores-1.jpg?alt=media&token=c0876563-a0e5-468d-abe6-f48e85f250ad",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2Fmens-family-owned-clothing-shop.jpg?alt=media&token=06cdd219-5302-4c60-8c28-bbc2611887f0",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2Farticle-2277649-1788FE8E000005DC-518_634x382.jpg?alt=media&token=aff5c7e0-7a62-4f12-9590-17b264796ec9",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2Foutdoor-clothing-shop-in-the-lake-district_1000X750.jpg?alt=media&token=61b993cc-3c99-47dc-9ccc-1e0214e86113",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2Fhongdae21.jpg?alt=media&token=d8ad87c8-fafb-4fc5-8fd2-88f4deb15128",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2FHorizons-Vintage-NYC-2.jpg?alt=media&token=ff1e59a2-2634-40c9-b6ce-dccef0c41859",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2FIMG_1680.jpg?alt=media&token=662286bf-d2af-49bb-924c-21bf68dcfab9",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/clothingShops%2Fwomens%20clothing%20shops2.jpg?alt=media&token=4faac953-259a-45b9-9e0c-218e1e0f33a3"
  ]
  return a.shuffle()[0]
end

def random_clothing_speciality()
  a=['Men', 'Men, Women', 'Women', 'Kids', 'Men, Women, Kids', 'Accessories', 'Men, Women, Kids, Accessories']
  return a.shuffle()[0]
end

def create_shop()
  shop ={
    address: Faker::Address.street_address,
    banner: random_image(),    
    speciality: random_clothing_speciality(),
    name: Faker::Company.name,
    workingTime: "6:00pm - 12:00am",
    email: Faker::Internet.email
  }
  items = []
  10.times do |item|
    items << {name: Faker::Commerce.product_name, price: Faker::Commerce.price, description: Faker::Lorem.sentence(10, false, 40), imgUrl: random_image(), inStock: true}
  end
  shop[:items] = items
  return shop
end

30.times do |shop|
  shop = create_shop()
  firebase.push("clothingShops", shop)
end
