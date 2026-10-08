import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export const searchProteins = async (
    query,
    method = "bm25",
    topK = 10
) => {
    const response = await API.get(
        "/api/search",
        {
            params: {
                q: query,
                method: method,
                top_k: topK,
            },
        }
    );

    return response.data;
};

export const getProtein = async (proteinId) => {
    const response = await API.get(
        `/api/proteins/${proteinId}`
    );

    return response.data;
};

export const getProteinStructures = async (proteinId) => {
    const response = await API.get(
        `/api/proteins/${proteinId}/structures`
    );

    return response.data;
};