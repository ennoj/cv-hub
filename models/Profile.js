const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    // Yhdistetään User-modelin käyttäjään
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  username: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  relationship: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  social: [
    {
      facebook: {
        type: String
      },
      twitter: {
        type: String
      },
      instagram: {
        type: String
      },
      im: {
        type: String
      }
    }
  ],
  links: {
    type: [String]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
