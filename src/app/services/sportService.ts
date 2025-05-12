import { Sport } from "../_types";

export const sportService = {
  async getSports(): Promise<Sport[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sports`, {
      headers: {
        Authorization: `Bearer ${
          document.cookie.split("token=")[1].split(";")[0]
        }`,
      },
    });

    if (!response.ok) throw new Error("Error al cargar deportes");
    return response.json();
  },
};
