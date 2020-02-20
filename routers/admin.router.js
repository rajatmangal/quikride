const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose');
const users = require('../models/user')
AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  branding: {
      logo: 'https://i.ibb.co/Xtfx7Hn/logo-470.png',
      companyName: 'Quik Ride'
  },
  resources: [{
      resource: users,
      options:{
        parent: {
            name: 'Users Management',
            icon: 'fas fa-users',
        }
      }
  }],
})


const admin = {
    email: process.env.ADMIN_EMAIL || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password'
}


const router = AdminBroExpress.buildAuthenticatedRouter(adminBro , {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'SOMEPASSWORD HERE',
    authenticate: async (email,password) => {
        if(email === admin.email && password === admin.password) {
            return admin;
        }
        return null;
    }
})

module.exports = router;