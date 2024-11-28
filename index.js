const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./config/db');
const User = require('./models/User');
const Exercise = require('./models/Exercise');

require('dotenv').config()

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// create a user
app.post('/api/users', async (req,res) => {
  try{
    const usernameInput = req.body.username;
    if (!usernameInput) {
      return res.status(500).json({error:'please input username'});
    };
    const user = await User.create({username:usernameInput});
    console.log(user);
    return res.json({
      _id:user._id,
      username:user.username
    });
  }catch (error){
    res.status(500).json({error:error.message});
  }
});

// get all users
app.get('/api/users',async (req,res) => {
  try{
    const allUsers = await User.find({});
    res.json(allUsers);
  }catch (error){
    res.status(500).json({error:error.message});
  }
})

// add exercise by user id
app.post('/api/users/:id/exercises',async (req,res) => {
  try{
    const user = await User.findById(req.params.id).exec();
    if (!user){
      throw res.status(404).json({error:'user not found'});
    }

    const { description,duration,date } = req.body;
    const exercise = await Exercise.create({
      user_id:req.params.id,
      description,
      duration,
      date:date || new Date()
    });
    return res.json({
      _id:user._id,
      username:user.username,
      description:exercise.description,
      duration:exercise.duration,
      date:exercise.date
    });
    
  }catch (error){
    res.status(400).json({ 
      error: error.message || '创建运动记录失败'
    });
  }
});

// get all logs by user id
app.get('/api/users/:id/logs', async (req,res) => {
  try{
    const user = await User.findById(req.params.id).exec();
    const {_id,username} = user;
    const logCount = await Exercise.countDocuments({user_id:req.params.id});

    const { from,to,limit } = req.query;
    let dateFilter = { user_id : req.params.id };

    if( from || to){
      dateFilter.date = {};
      if(from) dateFilter.date.$gte = new Date(from);
      if(to) dateFilter.date.$lte = new Date(to);
    }

    const log = await Exercise
      .find(dateFilter)
      .limit(Number(limit) || 0)
      .select('-_id description duration date');

    return res.json({
      _id,
      username,
      count:logCount,
      log
    });
  }catch (error){
    res.status(500).json({error:error.message});
  }
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
