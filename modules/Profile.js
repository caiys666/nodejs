const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 实例化模板
const ProfileSchema = new Schema({
  user: {
    // 关联数据表
    type: String,
    ref: 'users',
    require: true,
  },
  handle: {
    type: String,
    require: true,
    max: 40,
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  skills: {
    type: [String],
    require: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      current: {
        type: Boolean,
        default: true,
      },
      title: {
        type: String,
        require: true,
      },
      company: {
        type: String,
        require: true,
      },
      location: {
        type: String,
      },
      from: {
        type: String,
        require: true,
      },
      to: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      current: {
        type: Boolean,
        default: true,
      },
      school: {
        type: String,
        require: true,
      },
      degree: {
        type: String,
        require: true,
      },
      fieldofstudy: {
        type: String,
      },
      from: {
        type: String,
        require: true,
      },
      to: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    wechat: {
      type: String,
    },
    QQ: {
      type: String,
    },
    tengxunkt: {
      type: String,
    },
    wangyikt: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
module.exports = Profile = mongoose.model('profile', ProfileSchema)
