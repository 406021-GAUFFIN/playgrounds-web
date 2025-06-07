import { BaseEntity } from "../../../types/baseEntity";

export interface Rating extends BaseEntity {
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    id: number;
  };
}

export interface Space extends BaseEntity {
  name: string;
  address: string;
  schedule: string;
  conditions: string;
  isAccessible: boolean;
  description: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  sports: Sport[];
  averageRating: number | null;
  ratings: Rating[];
}

export interface Sport extends BaseEntity {
  name: string;
  pictogram: string;
  minParticipants: number;
  maxParticipants: number;
}
