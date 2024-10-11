require('dotenv').config();
// jest.setup.js
// Controlla se esiste una variabile d'ambiente `APP_ENV`, altrimenti usa 'test' come fallback 
process.env.NODE_ENV = process.env.APP_ENV || 'test';