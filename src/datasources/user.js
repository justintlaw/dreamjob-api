'use strict'

const { db } = require('./db')

const getAllUsers = async () => {
  const users = await db.UserModel
    .query()

  return {
    users
  }
}

const getUser = async (id) => {
  const user = await db.UserModel
    .query()
    .findById(id)

  return {
    user
  }
}


module.exports = {
  getAllUsers,
  getUser
}
