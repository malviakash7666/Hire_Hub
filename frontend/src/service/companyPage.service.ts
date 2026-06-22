import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api/companies";

export const companyService = {
  createCompanyProfile: async (data: any) => {
    const response = await axios.post(BACKEND_URL, data);
    return response.data;
  },

  getAllCompanyProfiles: async () => {
    const response = await axios.get(BACKEND_URL);
    return response.data;
  },

  getSingleCompanyProfile: async (id: string) => {
    const response = await axios.get(`${BACKEND_URL}/${id}`);
    return response.data;
  },

  updateCompanyProfile: async (id: string, data: any) => {
    const response = await axios.put(`${BACKEND_URL}/${id}`, data);
    return response.data;
  },

  deleteCompanyProfile: async (id: string) => {
    const response = await axios.delete(`${BACKEND_URL}/${id}`);
    return response.data;
  },
};