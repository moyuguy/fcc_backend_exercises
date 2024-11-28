const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chaos',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const db = mongoose.connection;
db.on('error',console.error.bind('连接错误：'));
db.once('open',function(){
    console.log('MongoDB connected.');
});