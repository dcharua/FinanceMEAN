const express = require('express');
const router = express.Router();
const passport = require('passport');
const Saving = require('../models/saving');

// for all the savings route we want user to be authorized
router.all("/*", passport.authenticate('jwt', {
  // if it is not valid return session as false
  session: false
}), (req, res, next) => {
  // return user to check credentials 
  res.locals.user  = req.user;
  // if it is valid allow next() got to route;
  next();
});


// Register a Saving
router.post('/add', (req, res, next) => {
  const user = res.locals.user;
  if (user._id == req.body.userId || user.type == 'a'){
    // Create a new user with the information that they subscribed
    let newSaving = new Saving({
      userId: req.body.userId,
      bank: req.body.bank,
      account: req.body.account,
      balance: req.body.balance,
      start: req.body.start,
      end: req.body.end,
      interest: req.body.interest,
      taxes: req.body.taxes
    });

    // Add saving to the db
    Saving.addSaving(newSaving, (err, saving) => {
      // Return the success state as false if it couldn't be registered
      if (err) {
        res.status(500).json({
          success: false,
          msg: err
        });
        // Return the success state as true if it could be registered
      } else {
        res.status(200).json({
          success: true,
          msg: err
        });
      }
    });
  } else {
    res.status(401).json({
      success: false,
      msg: 'Not authorized'
    });
  }
});


router.get('/getAll', (req, res) => {
  const user = res.locals.user;
  // check if user is admin
  if (user.type == 'a'){
    Saving.getAll((err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          msg: err
        });
      } else {
       
        res.status(200).json({
          success: true,
          data:  calculateInterest(data)
        });
      }
    });
  } else {
    res.status(401).json({
      success: false,
      msg: 'Not authorized'
    });
  } 
});

// Get One
router.get('/get/:id', (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;
    Saving.getOne(id, (err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          msg: err
        });
      } else {
        // check if user is owner of admin
        if (data.userId == user._id || user.type == 'a'){
          res.status(200).json({
            success: true,
            data: calculateInterest(data)
          });
        } else {
          res.status(401).json({
            success: false,
            msg: 'Not authorized'
          });
        }
      }
    });
});



router.put('/update/:id', (req, res) => {
  const user = res.locals.user;
  // check if user is owner of admin
  if (user._id == req.body.userId || user.type == 'a'){
    // create new object to update
    let updatedSaving = new Saving({
      _id: req.body._id,
      userId: req.body.userId,
      bank: req.body.bank,
      account: req.body.account,
      balance: req.body.balance,
      start: req.body.start,
      end: req.body.end,
      interest: req.body.interest,
      taxes: req.body.taxes
    });

    Saving.update(updatedSaving, (err, data) => {
        if (err) {
            res.status(500).json({
            success: false,
            msg: err
            });
        } else {
          res.status(200).json({
            success: true,
            data: data
          });
        }
    });
  } else {
    res.status(401).json({
      success: false,
      msg: 'Not authorized'
    });
  }
});

router.delete('/delete/:id', (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;
  // first get the saving to check that user is the owner
  Saving.getOne(id, (err, data) => {
    if (err) {
      res.status(500).json({
        success: false,
        msg: err
      });
    } else {
      // check if user is owner of admin
      if (data.userId == user._id || user.type == 'a'){
        Saving.delete(id, (err, data) => {
          if (err) {
            res.status(500).json({
              success: false,
              msg: err
            });
          } else {
            res.status(200).json({
              success: true,
              data: data
            });
          }
        });
      } else {
        res.status(401).json({
          success: false,
          msg: 'Not authorized'
        });
      }
    }
  });
});

// Get savings by user
router.get('/getSavingsByUser/:id', (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;
  // check if user is owner of admin
  if (user._id == id || user.type == 'a'){
    Saving.getSavingsByUser(id, (err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          msg: err
        });
      } else {
        res.status(200).json({
          success: true,
          data: calculateInterest(data)
        });
      }
    });
  } else {
    res.status(401).json({
      success: false,
      msg: 'Not authorized'
    });
  }
});

// Get sum of savings
router.post('/getFilterSavingsByUser/:id', (req, res) => {
  const user = res.locals.user;
  const { id } = req.params;
  // construct the filters
  const query = {
    userId: id,
    bank: req.body.bank, 
    balance: { $lte: req.body.balance_higher, $gte: req.body.balance_lower },
    start: {$gte: req.body.start}
  }
  if (!req.body.bank){
    delete query.bank
  }
  if (!req.body.start){
    delete query.start
  }

  // check if user is owner of admin
  if (user._id == id || user.type == 'a'){
    Saving.getFilterSavingsByUser(query, (err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          msg: err
        });
      } else {
        console.log(data.length)
        res.status(200).json({
          success: true,
          data: calculateInterest(data)
        });
      }
    });
  } else {
    res.status(401).json({
      success: false,
      msg: 'Not authorized'
    });
  }
});



function calculateInterest(savings){
  // check if object is empty
  if (Object.keys(savings).length == 0){
    return []
  }
  if (savings.length){
    return savings.map(saving => {
      return getInt(saving)
    });
  // if its just an object  
  } else {
    return getInt(savings);
  }
}

// get days from start to today
function getDays(date){
  today = new Date()
  // if date is in the future
  if (date > today) return 0
  
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date - today) / oneDay));
}

// main funtion to calculate interest
function getInt(saving){

  let castObj = saving.toObject();
  const days_elapsed = getDays(castObj.start);
  if (days_elapsed > 0){
    const interest_made = (days_elapsed / 360) * castObj.interest;
    castObj.interest_balance = (castObj.balance * interest_made) / 100;
    if (castObj.interest_balance > 0){
      const taxes_made = (days_elapsed / 360) * castObj.taxes;
      castObj.taxes_paid = (castObj.interest_balance * taxes_made) / 100;
    } else{
      castObj.taxes_paid = 0;
    }
  } else {
    castObj.interest_balance = 0;
    castObj.taxes_paid = 0;
  }
  return castObj;
}

// Router module for make the petitions
module.exports = router;

