type TId = { _id: string };
type TTimeStamp = { createdAt: string; updatedAt: string };
export interface IAddress extends TId, TTimeStamp {}
