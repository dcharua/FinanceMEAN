const mongoose = require('mongoose');

const SavingSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  bank: {
    type: String,
    required: true
  },
  account: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  interest: {
    type: Number,
    required: true
  },
  taxes: {
    type: Number,
    required: true
  }
});


const Saving = module.exports = mongoose.model('Saving', SavingSchema);

module.exports.addSaving = function(newSaving, callback) {
  newSaving.save(callback);
}

module.exports.getAll = (callback) => {
  Saving.find(callback).limit(1000);
}

module.exports.delete = (req, callback) => {
  const { id } = req.params;
  Saving.findByIdAndDelete(id, callback);
};

module.exports.getOne = (req, callback) => {
  const { id } = req.params;
  Saving.findOne({ _id: id }, callback);
};

module.exports.update = (data, callback) => {
  Saving.findByIdAndUpdate(data._id, data , callback);
};

module.exports.getAllSavings = function(userIdRecived, callback) {
  Saving.aggregate([{
      $match: {
        userId: userIdRecived
      }
    },
    {
      $project: {
        _id: 0,
        bank: 1,
        account: 1,
        balance: 1,
        start: 1,
        end: 1,
        interest: 1,
        taxes: 1
      }
    },
    {
      $sort: {
        start: 1
      }
    }
  ], callback);
}

module.exports.getSumSavingsByUser = function(userIdRecived, callback) {
  Saving.aggregate([{
      $match: {
        userId: userIdRecived
      }
    },
    {
      $group: {
        _id: null,
        AllSavings: {
          $sum: "$balance"
        }
      }
    },
    {
      $project: {
        AllSavings: 1
      }
    }
  ], callback);
}
