// ===== CONFIGURACIÓN GOOGLE SHEETS =====
// URL de tu Google Apps Script (la que me diste)
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzAslvlJEuoVZQ2sY9ipH7Ei6vD5gFQgyngP7g4uJc3Dtkb0jyEdYh8F-Sa-ZsL0p0j_A/exec';

// URL de tu Google Sheet (la que tienes compartida)
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1nu_IdO43-zRTVQF06CXydpG0PnbcGShBobXLvoRF_0w/edit?usp=sharing';

// Configuración de la aplicación
const APP_CONFIG = {
    VERSION: '1.0',
    NOMBRE: 'Sistema de Postulación a Premios - Carabineros de Chile',
    EMPRESA: 'Carabineros de Chile',
    ORDEN_GENERAL: 'OG 3125/2024',
    MAX_POSTULACIONES_LOCALES: 100,
    TIEMPO_ALERTA: 5000, // 5 segundos
    TIEMPO_SPINNER: 2000 // 2 segundos
};

// Exportar configuración
window.CONFIG = {
    GOOGLE_SHEETS_WEB_APP_URL,
    GOOGLE_SHEET_URL,
    APP_CONFIG
};
