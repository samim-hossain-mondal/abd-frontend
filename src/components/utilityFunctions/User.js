export function getCurrentUserID() {
  try {
    const oktaToken = JSON.parse(localStorage.getItem('okta-token-storage'));
    return oktaToken.accessToken.claims.uid;
  }
  catch (err) {
    return null;
  }
};

export function getAllMembersData(projectMembers) {
  return projectMembers.map((member) => ({ ...member, name: member.member.name, member: undefined }));
};

export default { getCurrentUserID, getAllMembersData };