import { Space } from "../_types";
import { PaginatedResponse } from "./_types";

export interface Event {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  dateTime: string;
  status: "available" | "confirmed" | "cancelled" | "finished" | "suspended";
  minParticipants: number;
  maxParticipants: number;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  space: Space;
  sport: {
    id: number;
    name: string;
    pictogram: string;
    minParticipants: number;
    maxParticipants: number;
  };
  participants: {
    id: number;
    name: string;
    email: string;
  }[];
}

export interface GetEventsParams {
  page?: number;
  pageSize?: number;
  spaceId?: number;
  status?: string[];
  futureOnly?: boolean;
  participantId?: number;
}

export const eventService = {
  async getEvents(
    params: GetEventsParams = {}
  ): Promise<PaginatedResponse<Event>> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params.spaceId)
      queryParams.append("spaceId", params.spaceId.toString());
    if (params.status)
      params.status.forEach((status) => queryParams.append("status", status));
    if (params.futureOnly !== undefined)
      queryParams.append("futureOnly", params.futureOnly.toString());
    if (params.participantId)
      queryParams.append("participantId", params.participantId.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar eventos");
    return response.json();
  },

  joinEvent: async (eventId: number): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/join`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al unirse al evento");
    }
  },

  leaveEvent: async (eventId: number): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/leave`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al salir del evento");
    }
  },

  cancelEvent: async (eventId: number): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cancelar el evento");
    }
  },
};
