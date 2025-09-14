
import { AbstractBackendClient } from "./AbstractBackendClient";
export abstract class BackendClient<RequestType, ResponseType> extends AbstractBackendClient<RequestType, ResponseType> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(): Promise<ResponseType[]> {
    const response = await fetch(`${this.baseUrl}`);
    const data = await response.json();
    return data as ResponseType[];
  }

  async getById(id: number): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async post(data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `Error HTTP ${response.status}`);
    }

    // Manejo seguro de respuesta: puede venir vac o no-JSON (201/204)
    const contentType = response.headers.get("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        return (await response.json()) as ResponseType;
      }
      const text = await response.text();
      if (text) {
        return JSON.parse(text) as ResponseType;
      }
    } catch (_) {
      // Ignorar parseo fallido y continuar con fallback
    }
    // Fallback: devolver el mismo payload tipado como respuesta
    return (data as unknown) as ResponseType;
  }

  async put(id: number, data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }
  

  // Método para eliminar un elemento por su ID
  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

    async patch(id: number | string, data: RequestType): Promise<ResponseType> {
    const response =
      await fetch(`${this.baseUrl}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    // const newData = await response.json();
    return "objeto actualizado" as ResponseType;
  }

}
