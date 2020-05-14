const express = require('express');
const router = express.Router();
const passport = require('passport');
const Saving = require('../models/saving');

// for all the savings route we want user to be authorized
router.all("/*", passport.authenticate('jwt', {
  // if it is not valid return session as false
  session: false
}), (req, res, next) => {
  // if it is valid allow next();
  next();
});
// Register a Saving
router.post('/add', (req, res, next) => {
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
});


router.get('/getAll', (req, res) => {
  Saving.getAll(req, (err, savings) => {
    console.log(req)
    if (err) {
      res.status(500).json({
        success: false,
        msg: savings
      });
    } else {
      res.status(200).json({
        success: true,
        data: savings
      });
    }
  });
});

// Get One
router.get('/get/:id', (req, res) => {
  const { id } = req.params;
  Saving.getOne(id, (err, data) => {
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
});



router.put('/update/:id', (req, res) => {
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
            resres.status(200).json({
            success: true,
            data: data
          });
        }
    });
});

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
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
});
// Get sum of savings
router.post('/getSumSavingsByUser', (req, res) => {
  const { id } = req.params;
  Saving.getSumSavingsByUser(id, (err, total) => {
    if (err) {
      res.status(500).json({
        success: false,
        msg: err
      });
    } else {
      res.status(200).json({
        success: true,
        data: total
      });
    }
  });
});

// Get savings by user
router.get('/getSavingsByUser/:id', (req, res) => {
  const { id } = req.params;
  Saving.getSavingsByUser(id, (err, data) => {
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
});

// Router module for make the petitions
module.exports = router;
