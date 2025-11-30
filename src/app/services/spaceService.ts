import { PaginatedResponse } from "../../types/pagination";
import { Space } from "../_types";

interface GetSpacesParams {
  page?: number;
  pageSize?: number;
  name?: string;
  isActive?: boolean;
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  sportIds?: number[];
  accessibilityIds?: number[];
  hasFutureEvents?: boolean;
  minRating?: number;
}

export const spaceService = {
  async getSpaces(
    params: GetSpacesParams = {}
  ): Promise<PaginatedResponse<Space>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params.name) queryParams.append("name", params.name);
    if (params.isActive !== undefined)
      queryParams.append("isActive", params.isActive.toString());
    if (params.minLat) queryParams.append("minLat", params.minLat.toString());
    if (params.maxLat) queryParams.append("maxLat", params.maxLat.toString());
    if (params.minLng) queryParams.append("minLng", params.minLng.toString());
    if (params.maxLng) queryParams.append("maxLng", params.maxLng.toString());
    if (params.sportIds)
      params.sportIds.forEach((id) =>
        queryParams.append("sportIds", id.toString())
      );
    if (params.accessibilityIds)
      params.accessibilityIds.forEach((id) =>
        queryParams.append("accessibilityIds", id.toString())
      );
    if (params.hasFutureEvents !== undefined)
      queryParams.append("hasFutureEvents", params.hasFutureEvents.toString());
    if (params.minRating)
      queryParams.append("minRating", params.minRating.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/spaces?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar espacios");

    return response.json();
  },

  async getSpaceById(id: string): Promise<Space> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/spaces/${id}`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar el espacio");
    return response.json();
  },
};
