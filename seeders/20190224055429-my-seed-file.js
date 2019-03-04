'use strict';

const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up : function (queryInterface, Sequelize) {
    
    queryInterface.bulkInsert('Categories', 
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', 
       '素食料理', '美式料理', '複合式料理'].map(d =>
      ({name: d, createdAt: new Date(), updatedAt: new Date(),})
    ), {});

    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: "root",
      image: faker.image.imageUrl(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: "user1",
      image: faker.image.imageUrl(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: "user2",
      image: faker.image.imageUrl(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    queryInterface.bulkInsert('Followships', [{
      followerId: 1,
      followingId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 1,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      followerId: 2,
      followingId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});



    queryInterface.bulkInsert('Comments', 
      [...Array(10)].map((_,i) => i).map(d =>
      ({
        text: faker.lorem.sentence(),
        userId: Math.floor(Math.random() * 3)+1,
        restaurantId: Math.floor(Math.random() * 10)+1,
        createdAt: new Date(), updatedAt: new Date(),
      })
    ), {});

    queryInterface.bulkInsert('Favorites', 
      [...Array(10)].map((_,i) => i).map(d =>
      ({
        userId: Math.floor(Math.random() * 3)+1,
        restaurantId: Math.floor(Math.random() * 10)+1,
        createdAt: new Date(), updatedAt: new Date(),
      })
    ), {});

    return queryInterface.bulkInsert('Restaurants', 
      [...Array(50)].map((_,i) => i).map(d =>
      ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: faker.image.imageUrl(),
        description: faker.lorem.text(),
        createdAt: new Date(), updatedAt: new Date(),
        categoryId: Math.floor(Math.random() * 5)+1,
      })
    ), {});
  },

  down : function (queryInterface, Sequelize) {
  }
};