import type { SuperAdminDTO } from "../types/superAdmin/SuperAdminDTO";
import type { SuperAdminResponseDTO } from "../types/superAdmin/SuperAdminResponseDTO";
import { BackendClient } from "./BackendClient";
export class SuperAdminService extends BackendClient<SuperAdminDTO, SuperAdminResponseDTO>{
    constructor(){
        super("http://localhost:8080/api/superadmin");
    }
}