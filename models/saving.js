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
    type: String,
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
  Saving.find(callback).sort([['start', 1]])
}

module.exports.delete = (id, callback) => {
  Saving.findByIdAndDelete(id, callback);
};

module.exports.getOne = (id, callback) => {
  Saving.findOne({ _id: id }, callback);
};

module.exports.update = (data, callback) => {
  Saving.findByIdAndUpdate({ _id: data._id}, data , callback);
};

module.exports.getSavingsByUser = (userId, callback) => {
  const query = {
    userId: userId
  }
  Saving.find(query,callback).sort([['start', 1]])
}



module.exports.getSumSavingsByUser = (userIdRecived, callback)  => {
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
