const express = require('express');
const router = express.Router();
const Saving = require('../models/saving');

// Register a Saving
router.post('/register', (req, res, next) => {
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
  Saving.addEgreso(newSaving, (err, saving) => {
    // Return the success state as false if it couldn't be registered
    if (err) {
      res.json({
        success: false,
        msg: err
      });
      // Return the success state as true if it could be registered
    } else {
      res.json({
        success: true,
        msg: err
      });
    }
  });
});


router.get('/getAll', (req, res, next) => {
  let userId = req.body.userId;

  Saving.getAll(userId, (err, savings) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        data: savings
      });
    }
  });
});

// Get One
router.get('/get/:id', (req, res, next) => {
  Saving.getOne(req, (err, data) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        data: data
      });
    }
  });
});



router.put('/update/:id', (req, res, next) => {
    let updatedSaving = new Saving({
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
            res.json({
            success: false,
            msg: err
            });
        } else {
            res.json({
            success: true,
            data: data
            });
        }
    });
});

router.delete('/delete/:id', (req, res, next) => {
  Saving.delete(req, (err, data) => {
        if (err) {
            res.json({
            success: false,
            msg: err
            });
        } else {
            res.json({
            success: true,
            data: data
            });
        }
    });
});
// Get sum of savings
router.get('/getSumSavingsByUser', (req, res, next) => {
  let userId = req.body.userId;

  Saving.getSumSavingsByUser(userId, (err, total) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        data: total
      });
    }
  });
});

// Get sum of savings
router.get('/getAllusers', (req, res, next) => {
  let userId = req.body.userId;

  Saving.getSumSavingsByUser(userId, (err, total) => {
    if (err) {
      res.json({
        success: false,
        msg: err
      });
    } else {
      res.json({
        success: true,
        data: total
      });
    }
  });
});

// Router module for make the petitions
module.exports = router;
