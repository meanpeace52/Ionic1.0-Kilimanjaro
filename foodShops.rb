require 'firebase'
require 'faker'
base_uri = 'https://kilimanjaro-80035.firebaseio.com/'
firebase = Firebase::Client.new(base_uri)


def random_image()
  a=["https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/foodShops%2F201611-orig-foods-sugar-1-949x534.jpg?alt=media&token=bf643cf6-3f57-42a8-9bd7-6a55476d8d56", "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/foodShops%2FChinese-food.jpg?alt=media&token=983fbc48-22ca-42a1-9dd4-c24c0d975e1c", "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/foodShops%2FESfood1c.jpg?alt=media&token=deb5e592-ffe8-4fdc-8313-58da44146cf3", "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/foodShops%2Ffatty-foods-grouped-together.jpg?alt=media&token=b04430f0-14d4-4a3c-ba32-de405b09de07", "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/foodShops%2Fimages.jpg?alt=media&token=2ce950d4-3f0d-45b3-b600-6da210482acd", "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/foodShops%2Fplant-based-foods-may-soon-be-indistinguishable-from-the-foods-they-imitate.jpg?alt=media&token=4e2fa6fd-196c-4a37-bf2b-55e0bec317cb"]
  return a.shuffle()[0]
end

def create_shop()
  shop ={
    address: Faker::Address.street_address,
    banner: random_image(),
    types: {delivery: [true, false].sample, pickup: [true, false].sample},
    speciality: Faker::Address.country,
    name: Faker::Company.name,
    workingTime: "6:00pm - 12:00am",
    email: Faker::Internet.email,
    priceType: ['$'].cycle([1,2,3].sample).to_a.join('')
  }
  items = []
  8.times do |item|
    items << {name: Faker::Food.spice, price: Faker::Commerce.price, description: Faker::Lorem.sentence(10, false, 40), imgUrl: random_image(), inStock: true}
  end
  shop[:items] = items
  return shop
end

10.times do |shop|
  shop = create_shop()
  firebase.push("foodShops", shop)
end
