const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose');
const users = require('../models/user')
const drivers = require('../models/drivers')
const messages = require('../models/messages')
const thread = require('../models/thread')
const rides = require('../models/shareRidePosts')
const posts = require('../models/posts')
const rideRequests = require('../models/ridesrequest')


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
  },
  {
    resource: drivers,
    options:{
      parent: {
          name: 'Users Management',
          icon: 'fas fa-users',
      }
    }
},
  {
    resource: messages,
    options:{
      parent: {
          name: 'Chat Messenger',
          icon: 'fas fa-comments',
      }
    }
},
{
    resource: thread,
    options:{
      parent: {
          name: 'Chat Messenger',
          icon: 'fas fa-comments',
      }
    }
},
{
    resource: rides,
    options:{
      parent: {
          name: 'Rides',
          icon: 'far fa-file',
      }
    }
},
{
    resource: posts,
    options:{
      parent: {
          name: 'Rides',
          icon: 'far fa-file',
      }
    }
},
{
    resource: rideRequests,
    options:{
      parent: {
          name: 'Rides',
          icon: 'far fa-file',
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