import { BaseEntity } from "./types/baseEntity";

export interface Sport extends BaseEntity {
  name: string;
  pictogram: string;
  minParticipants: number;
  maxParticipants: number;
}

export interface Space extends BaseEntity {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  isAccessible: boolean;
  schedule: string;
  conditions: string;
  description: string;
  sports: Sport[];
}
