import { AxiosError } from "axios";
import { tesloApi } from "../api/teslo.api";

export interface LoginResponse {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: string[];
  token: string;
}


export class AuthService {
  static login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const { data } = await tesloApi.post<LoginResponse>('/auth/login', { email, password });
      console.log(data);
      return data;
    } catch(err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data);
        throw new Error(err.response?.data);
      }
      console.log(err)
      throw new Error('Unable to login!')
    }
  }

  static checkStatus = async (): Promise<LoginResponse> => {
    try {
      const { data } = await tesloApi.get<LoginResponse>('/auth/check-status');
      return data;
    } catch(error) {
      console.log(error);
      throw new Error('Unauthorized');
    }
  }


}