'use strict'

const getAllSkills = async () => {
  return {
    skill1: 'skilllls',
    skill2: 'another skill'
  }
}

const getSkill = async (skillId) => {
  return {
    skill: `skill_${skillId}`
  }
}

module.exports = {
  getAllSkills,
  getSkill
}