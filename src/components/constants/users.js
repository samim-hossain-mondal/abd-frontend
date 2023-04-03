export const USER_ROLES = {
  ADMIN: 'ADMIN',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
}

export const roles = Object.values(USER_ROLES)

export const isLeader = (userRole) => userRole === USER_ROLES.LEADER
export const isAdmin = (userRole) => userRole === USER_ROLES.ADMIN
export const isMember = (userRole) => userRole === USER_ROLES.MEMBER

// export const isAdmin = () => false;
// export const isMember = () => true;
