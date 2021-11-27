const getMatchedUserInfo = (users, selfUserId) => {
  const newUsers = { ...users };
  delete newUsers[selfUserId];

  /*
  {
      {
      }
  }
  轉換成 => [id, {}]
  */
  const [id, user] = Object.entries(newUsers).flat();

  return { id, ...user };
};

export default getMatchedUserInfo;
