'use strict'

const { db } = require('./db')

const getAllSkills = async () => {
  const skills = await db.SkillModel
    .query()

  return {
    skills
  }
}

const getSkill = async (skillId) => {
  const skill = await db.SkillModel
    .query()
    .findById(skillId)

  return {
    skill
  }
}

module.exports = {
  getAllSkills,
  getSkill
}
