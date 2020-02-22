const mongoose = require('mongoose');

if(process.env.USE_MONGO_CLUSTER) { 
    mongoose.connect('mongodb+srv://mongoadmin:cmpt470carpool@cluster0-yeuix.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
} else {
    mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
}
var db = mongoose.connection;