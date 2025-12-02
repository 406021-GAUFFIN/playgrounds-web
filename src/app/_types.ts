import { Rating } from "./spaces/_types";
import { BaseEntity } from "./types/baseEntity";

export interface Sport extends BaseEntity {
  name: string;
  pictogram: string;
  minParticipants: number;
  maxParticipants: number;
}

export interface Accessibility extends BaseEntity {
  name: string;
  description: string;
}

export interface Space extends BaseEntity {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  schedule: string;
  conditions: string;
  description: string;
  sports: Sport[];
  averageRating: number | null;
  ratings: Rating[];
  accessibilities: Accessibility[];
}
