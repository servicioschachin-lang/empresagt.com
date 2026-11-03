/* Configuración de la aplicación */
export const CONFIG = {
  CREAWEB_URL: 'https://chachingt.com',
  FORMSPREE: 'https://formspree.io/f/xrengvqb',
  DOMINIO: 'empresagt.com',
  LIMITE_HTML: 900000,
  STORE_KEY: 'creaweb_estado_v1',
  RESERVADOS: ['www', 'admin', 'mail', 'correo', 'ftp', 'api', 'app', 'panel', 'creaweb', 'soporte', 'ayuda', 'test'],
  TEMPLATES: [
    { nombre: 'Servicios Chachin', icon: '', url: 'https://chachingt.com' },
    { nombre: 'Guíarte Atilan Gt', icon: '', url: 'https://guiarteatitlan.empresagt.com' },     
    { nombre: 'Cleaning Cap', icon: 'store', url: 'https://cleaningcapsp.com/catalogo.html' }, 
    { nombre: 'Transportes Xilo', icon: 'car', url: 'https://transportesxilo.empresagt.com' }, 
    { nombre: 'Portafolio', icon: 'box', url: 'https://chach.app' },
    { nombre: '3 Ajpu Cumbres', icon: 'trash', url: 'https://3ajpucumbres.empresagt.com' },        
    { nombre: 'Transporte Navi', icon: 'bus', url: 'https://paginavi.chach.workers.dev' },      
    { nombre: 'Hospedaje Ku´ Kanche', icon: 'house', url: 'https://hospedajekukanche.empresagt.com' }, 
    { nombre: 'Ibcoxej', icon: 'school', url: 'https://ibcoxej.chach.app' },
    { nombre: 'Mundos en Alianza', icon: 'bottle', url: 'https://mundosenalianza.chach.app' }, 
    { nombre: 'Marimba Ancestral', icon: 'instrument', url: 'https://marimbaancestral.empresagt.com' }, 
    { nombre: 'DJ Mxilo', icon: 'instrument', url: 'https://djxilo.empresagt.com' }, 
    { nombre: 'Traditional Foods', icon: 'utensils', url: 'https://natalyfoods.vercel.app' },
    { nombre: 'Creaweb', icon: 'box', url: 'https://creaweb.chach.app' },
    { nombre: 'Web.Chach', icon: 'table', url: 'https://web.chach.app' },
    { nombre: 'Crear web', icon: 'paper', url: 'https://crearweb.chach.app' },
  ],
 };

export const SOCIAL_PATTERNS = /(facebook\.com|fb\.com|instagram\.com|tiktok\.com|wa\.me|whatsapp\.com|twitter\.com|x\.com|youtube\.com|youtu\.be|linkedin\.com|t\.me|telegram)/i;

export const SOCIAL_NAMES = [
  [/facebook|fb\.com/i, 'Facebook'],
  [/instagram/i, 'Instagram'],
  [/tiktok/i, 'TikTok'],
  [/wa\.me|whatsapp/i, 'WhatsApp'],
  [/twitter|x\.com/i, 'X / Twitter'],
  [/youtube|youtu\.be/i, 'YouTube'],
  [/linkedin/i, 'LinkedIn'],
  [/t\.me|telegram/i, 'Telegram']
];
