require 'firebase'
require 'faker'
require 'active_support/core_ext'

base_uri = 'https://kilimanjaro-80035.firebaseio.com/'
firebase = Firebase::Client.new(base_uri)


def random_image()
  a=["https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2Fcorporate.jpg?alt=media&token=974f4e7a-05e8-49da-8a7b-fc9d95d5d2d8",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2FEvening%20Events-960w-463h.jpg?alt=media&token=0ada102f-8042-4f1c-818d-363f77905f4f",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2Fevents-heavenly-header.jpg?alt=media&token=43a0128f-0bdb-4473-bf81-44ce3d4920b0",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2Fevents.jpg?alt=media&token=0b2c4a35-c589-4fca-b703-3d24d7992e44",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2Ffrederique-menard-aubin_montreal-en-lumiere_185-bravos-8_copy.jpg?alt=media&token=272155b9-b686-44dc-a358-ad52fdac0010",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2FSetup-D-01-1024x681.jpg?alt=media&token=51e15cb9-2ca0-40b4-8dfd-10ac5257c25d",
    "https://firebasestorage.googleapis.com/v0/b/kilimanjaro-80035.appspot.com/o/events%2Fthailand-sky-lanterns.jpg?alt=media&token=dada3e3f-cb92-40a3-9b07-c07e4ea4b035"
  ]
  return a.shuffle()[0]
end


def create_event()
  event ={
    address: Faker::Address.street_address,
    banner: random_image(),    
    title: Faker::Lorem.sentence(3, false, 1),
    description: Faker::Lorem.paragraph,
    startTime: (Time.now.to_i)*1000,
    endTime: ((Time.now+2.day).to_i)*1000,
    email: Faker::Internet.email,
    contactName: Faker::Name.name,
    phoneNumber: Faker::PhoneNumber.cell_phone    
  }
#  items = []
#  10.times do |item|
#    items << {name: Faker::Commerce.product_name, price: Faker::Commerce.price, description: Faker::Lorem.sentence(10, false, 40), imgUrl: random_image(), inStock: true}
#  end
#  shop[:items] = items
  return event
end

10.times do |shop|
  event = create_event()
  firebase.push("general", event)
end
