class FollowersModel  {
    public id: number;
    public userId: number;
    public vacationId: number;


    public constructor(followers: FollowersModel) {
      this.id = followers.id,
      this.userId = followers.userId,
      this.vacationId = followers.vacationId
    };
}

export default FollowersModel;