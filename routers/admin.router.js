const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose')
const mongoose = require('mongoose');
const Users = require('../models/user')
AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

module.exports = router;