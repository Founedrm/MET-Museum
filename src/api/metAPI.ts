import axios from 'axios';

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export const searchObjects = (params: Record<string, string | number | undefined>) =>
    axios.get(`${BASE_URL}/search`, { params });

export const getObjectById = (id: number) =>
    axios.get(`${BASE_URL}/objects/${id}`);

export const getDepartments = () =>
    axios.get(`${BASE_URL}/departments`);
