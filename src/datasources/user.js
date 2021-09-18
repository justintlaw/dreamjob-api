'use strict'

const { UserModel, JobModel, TimelineModel, SkillModel } = require('./db')

// TODO
// this should be an admin only function
const getAllUsers = async () => {
  const users = await UserModel
    .query()

  return {
    users
  }
}

// should only work if id matches the user
const getUser = async (user, id) => {
  if (!user || user?.sub !== id) {
    return {}
  }

  const userInfo = await UserModel
    .query()
    .findById(user.sub)
    .withGraphFetched('skills')

  if (!userInfo) {
    return {}
  }

  const userJobCount = await JobModel
    .query()
    .count('id as numJobs')
    .where('userId', user.sub)

  const userTimelineCount = await TimelineModel
    .query()
    .count('id as numTimelines')
    .where('userId', user.sub)

  return {
    ...userInfo,
    jobCount: userJobCount[0].numJobs,
    timelineCount: userTimelineCount[0].numTimelines
  }
}

const addSkillToUser = async (id, cognitoId, skill) => {
  const user = await UserModel
    .query()
    .findById(id)
    .withGraphJoined('skills')

  const userSkillIds = user.skills.map(skill => skill.id)
  // console.log('userskills', userSkills)

  const existingSkill = await SkillModel
    .query()
    .findOne({
      name: skill
    })

  // relate the skill if it already exists
  if (existingSkill) {
    // is this error checking necessary,
    // or is a "400" error enough?
    if (!userSkillIds.includes(existingSkill.id)) {
      await UserModel
      .relatedQuery('skills')
      .for(id)
      .relate(existingSkill)
    }
  }

  // create and relate the skill if it doesn't already exist
  if (!existingSkill) {
    const createdSkill = await SkillModel
      .query()
      .insertAndFetch({
        name: skill
      })

    await UserModel
      .relatedQuery('skills')
      .for(id)
      .relate(createdSkill)
  }

  const updatedUser = await getUser({ sub: cognitoId }, id)

  return {
    ...updatedUser
  }
}

const removeSkillFromUser = async (id, cognitoId, skill) => {
  if (id !== cognitoId) return

  const skillToRemove = await SkillModel
    .query()
    .findOne({
      name: skill
    })

  await UserModel
    .relatedQuery('skills')
    .for(id)
    .unrelate()
    .where('skillId', skillToRemove.id)

  const updatedUser = await getUser({ sub: cognitoId }, id)

  return {
    ...updatedUser
  }
}

// creates a user given a sub (from cognito)
// TODO: update this
const createUser = async (userData) => {
  const currentUser = await UserModel
    .query()
    .findById(userData.id)

  if (currentUser) {
    return { ...currentUser }
  }

  const user = await UserModel
    .query()
    .insertAndFetch({
      id: userData.id,
      name: userData.name,
      email: userData.email
    })

  return { ...user }
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  addSkillToUser,
  removeSkillFromUser
}
