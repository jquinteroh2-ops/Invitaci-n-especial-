/* ═══════════════════════════════════════════════════════════
   SERVIDOR · sirve la invitación en Railway
   No necesita instalar nada: usa solo lo que trae Node.
   ═══════════════════════════════════════════════════════════ */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PUERTO = process.env.PORT || 3000;
const RAIZ   = __dirname;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'text/javascript; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg' : 'image/jpeg',
  '.png' : 'image/png',
  '.webp': 'image/webp',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
  '.mp3' : 'audio/mpeg',
  '.m4a' : 'audio/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt' : 'text/plain; charset=utf-8',
};

// Carpetas y archivos que nunca se sirven (documentación interna).
const PRIVADO = ['hoja-de-calculo', 'leeme.md', 'server.js', 'package.json', '.git'];

http.createServer((req, res) => {
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch (_) {
    res.writeHead(400).end('Petición inválida');
    return;
  }

  if (ruta === '/') ruta = '/index.html';

  // el archivo pedido tiene que quedar dentro de la carpeta del proyecto
  const archivo = path.join(RAIZ, path.normalize(ruta));
  if (!archivo.startsWith(RAIZ + path.sep)) {
    res.writeHead(403).end('Prohibido');
    return;
  }

  const relativo = path.relative(RAIZ, archivo).replace(/\\/g, '/').toLowerCase();
  if (PRIVADO.some(p => relativo === p || relativo.startsWith(p + '/'))) {
    res.writeHead(404).end('No encontrado');
    return;
  }

  fs.readFile(archivo, (err, datos) => {
    if (err) {
      // una ruta sin extensión (alguien escribió mal la URL) igual ve la invitación
      if (!path.extname(ruta)) {
        fs.readFile(path.join(RAIZ, 'index.html'), (e2, html) => {
          if (e2) { res.writeHead(404).end('No encontrado'); return; }
          res.writeHead(200, { 'Content-Type': TIPOS['.html'] }).end(html);
        });
        return;
      }
      res.writeHead(404).end('No encontrado');
      return;
    }

    const ext = path.extname(archivo).toLowerCase();
    const esHtml = ext === '.html';
    res.writeHead(200, {
      'Content-Type' : TIPOS[ext] || 'application/octet-stream',
      // el HTML siempre fresco; fotos, música y estilos se guardan en caché
      'Cache-Control': esHtml ? 'no-cache' : 'public, max-age=604800',
    }).end(datos);
  });
}).listen(PUERTO, () => {
  console.log('Invitación sirviéndose en el puerto ' + PUERTO);
});
