import { Space } from "../_types";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface GetSpacesParams {
  page?: number;
  pageSize?: number;
  name?: string;
  isActive?: boolean;
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
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
};
