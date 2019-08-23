/* eslint-disable import/no-commonjs */
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const {db} = require('../../db')
const {authMiddleware} = require('./middleware')

const privateKey = fs.readFileSync(
  path.join(__dirname, '..', '..', 'config', 'cert', 'private_key.pem')
)

const router = express.Router()

const signToken = (data) => {
  const payload = {
    id: data.id,
    username: data.username
  }

  const token = jwt.sign(
    payload,
    privateKey,
    {
      algorithm: 'RS256'
    }
  )
  return token
}

const getUserByName = (username) => {
  const result = db.get('users')
    .find({username})
    .value()

  return result
}

// 用户注册
router.post('/users', (req, res, next) => {
  const {username, password} = req.body
  const user = getUserByName(username)

  if (user) {
    res.status(409).jsonp('用户名被占用了')
    return
  }

  bcrypt.hash(password, 10)
    .then(passwordHash => {
      req.body.password = passwordHash
      next()
    })
})

// 用户登录
router.post('/user-login', (req, res) =>{
  const {username, password} = req.body
  const user = getUserByName(username)

  if (!user) {
    res.status(404).jsonp('用户名不存在。')
    return
  }

  bcrypt.compare(password, user.password)
    .then(result => {
      if (result) {
        const token = signToken(user)
        res.jsonp({
          id: user.id,
          username: user.username,
          token
        })
      } else {
        res.status(401).jsonp('密码不匹配！')
      }
    })

})

// 验证JWT
router.post('/token/validate', authMiddleware, (req, res) => {
  res.jsonp('valid')
})

module.exports = router
