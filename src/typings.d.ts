export enum Types {
  Featured = 'featured',
  Upwork = 'upwork',
  Personal = 'personal',
}

export interface Work {
  _id: string;
  thumbnailFile: File;
  thumbnailUrl: string;
  title: string;
  text: string;
  category: string;
  source: string;
  liveUrl: string;
  type: Types;
  priorityOrder: number;
}
