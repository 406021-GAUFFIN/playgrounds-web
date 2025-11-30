import { Accessibility } from "../_types";

export const accessibilityService = {
  async getAccessibilities(): Promise<Accessibility[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/accessibility`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al cargar accesibilidades");
    return response.json();
  },
};
