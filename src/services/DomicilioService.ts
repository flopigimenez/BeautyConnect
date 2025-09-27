import type { DomicilioResponseDTO } from "../types/domicilio/DomicilioResponseDTO";
import type { DomicilioDTO } from "../types/domicilio/DomicilioDTO";
import { BackendClient } from "./BackendClient";
export class DomicilioService extends BackendClient<DomicilioDTO, DomicilioResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/domicilio");
    }

    async updateDomicilio(id: number, data: DomicilioDTO): Promise<DomicilioResponseDTO> {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        return response.json();
    }
}