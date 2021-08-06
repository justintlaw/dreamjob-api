'use strict'

const { SkillModel } = require('./db')

const getAllSkills = async () => {
  const skills = await SkillModel
    .query()

  return {
    skills
  }
}

const getSkill = async (skillId) => {
  const skill = await SkillModel
    .query()
    .findById(skillId)

  return {
    ...skill
  }
}

const createSkill = async (newSkill) => {
  const skill = await SkillModel
    .query()
    .insert(newSkill)

  return {
    ...skill
  }
}

/*
  Should only be available to the admin so that a user doesn't update
  a skill being used by another user
*/
const updateSkill = async (id, newSkill) => {
  const skill = await SkillModel
    .query()
    .findById(id)
    .patch(newSkill)

  return {
    ...skill
  }
}

// TODO restrict this to admin
// Ideally, unused skills would be deleted after 30 days, etc.
const deleteSkill = async (id) => {
  await SkillModel
    .query()
    .deleteById(id)

  return {}
}

module.exports = {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
}
