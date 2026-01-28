import Dexie from 'dexie';

export const db = new Dexie("layoutDB");

db.version(1).stores({
    layouts: '++id, nome, codigo'
})

import axios from 'axios';

export const api = axios.create({
    // baseURL: `http://localhost:3000/registros`
    baseURL: `https://imprimir-capas-back-b2kifuwiw-kwills-projects.vercel.app/registros`
})