const UserRoles = {
  ADMINISTRATOR: 1,
  ERGONOMIST: 2,
  TECHNICIAN: 3,
  RESPONSIBLE: 4,
  EMPLOYEE: 5,
}

function getRoleText(roleNumber) {
  const UserRolesNumbering = {
    1: 'Administrator',
    2: 'Specialist',
    3: 'Assistant',
    4: 'Supervisor',
    5: 'Collaborator',
  }

  return UserRolesNumbering[roleNumber] || 'Unknown role'
}

export default { UserRoles, getRoleText }
