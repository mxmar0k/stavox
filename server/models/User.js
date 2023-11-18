const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  // username: {
  //   type: String,
  //   required: false,
  //   unique: true,
  //   trim: true
  // },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    required: true,
    enum: ['creator', 'follower'], default: 'follower'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  credits: {
    type: Number,
    default: 0
  },
  // subscribedTo: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Subscription'
  //   }
  // ],
  // content: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Content'
  //   }
  // ]
},
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 5;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);
module.exports = User;


