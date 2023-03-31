export const USER_ROLES = {
  ADMIN: 'ADMIN',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
}

export const isAdmin = (userRole) => userRole === USER_ROLES.ADMIN
export const isLeader = (userRole) => userRole === USER_ROLES.LEADER
export const isMember = (userRole) => userRole === USER_ROLES.MEMBER