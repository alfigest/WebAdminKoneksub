export default class RewardTransaction{
  constructor(id, accept, createdAt, optionId, points, subOptionId, userId){
    this.id = id;
    this.accept = accept;
    this.createdAt = createdAt;
    this.optionId = optionId;
    this.points = points;
    this.subOptionId = subOptionId;
    this.userId = userId;
  }
}
