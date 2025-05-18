export interface IFaq {
  _id: string;
  questionUz: string;
  questionRu: string;
  questionEn: string;
  answerUz: string;
  answerRu: string;
  answerEn: string;
  status: 0 | 1;
}

export interface IFaqOrder {
  _id: string;
  index: number;
}
