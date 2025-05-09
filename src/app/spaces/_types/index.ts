import { BaseEntity } from "../../../types/baseEntity";

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
}

export interface Sport extends BaseEntity {
  name: string;
  pictogram: string;
  minParticipants: number;
  maxParticipants: number;
}
