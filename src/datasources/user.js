'use strict'

const getAllUsers = async () => {
  return {
    user: 'test_user_1',
    user2: 'tesst_user_2'
  }
}

const getUser = async (id) => {
  return {
    user: `test_user_${id}`
  }
}


module.exports = {
  getAllUsers,
  getUser
}
