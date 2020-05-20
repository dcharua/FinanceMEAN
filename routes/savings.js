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
          data:  calculateInterest(data, null)
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
            data: calculateInterest(data, null)
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

// Get projected interest and texes form end date
router.post('/getProjectionsByUser/:id', (req, res) => {
  
  const user = res.locals.user;
  const { id } = req.params;
  const end_date = req.body.end_date;
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
          data: calculateInterest(data, end_date)
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



function calculateInterest(savings, end_date){
  // check if object is empty
  if (Object.keys(savings).length == 0){
    return []
  }
  if (savings.length){
    return savings.map(saving => {
      return getInt(saving, end_date)
    });
  // if its just an object  
  } else {
    return getInt(savings, end_date);
  }
}

// get days from start to today
function getDays(start, end, end_date){
  // if we recive date (projection) make that today otherwise get today's date
  today = end_date ? new Date(end_date) : new Date();
  // if date is in the future
  if (start > today) return 0
  if (today > end){
    today = end;
  } 
  // formula to calulcate days elepsed from two JS dates
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((start - today) / oneDay));
}

// main funtion to calculate interest
function getInt(saving, end_date){

  let castObj = saving.toObject();
  // get how many days have passes from start.date to end.date
  const days_elapsed = getDays(castObj.start, castObj.end, end_date);
  if (days_elapsed > 0){
    // calulcate interest made, days dividend by 360 time the interest rate to get interest so far
    const interest_made = (days_elapsed / 360) * castObj.interest;
    castObj.interest_balance = (castObj.balance * interest_made) / 100;
    // if interest is positive deduct taxes to interest made else taxes is 0
    castObj.taxes_paid = castObj.interest_balance > 0 ? (castObj.interest_balance * castObj.taxes) / 100 : 0;
  // if no days have passes since start date theres no interest and no taxes
  } else {
    castObj.interest_balance = 0;
    castObj.taxes_paid = 0;
  }
  return castObj;
}

// Router module for make the petitions
module.exports = router;

