'use strict'

const { UserModel } = require('./db')

const getAllUsers = async () => {
  const users = await UserModel
    .query()

  return {
    users
  }
}

const getUser = async (id) => {
  const user = await UserModel
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
