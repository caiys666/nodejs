const bcrypt = require('bcryptjs')

const tools = {
  // 进行密码加密操作
  enbcrypt(password) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
  },
}
module.exports = tools
