# Invitación de boda · Miguel Andrés & Daniela Patricia

Invitación web pensada **primero para celular**: sobre animado, cuenta regresiva,
carrusel de fotos deslizable, barra de navegación fija y confirmación por WhatsApp.
Paleta beige claro + oro.

## Cómo verla
Abre `index.html` con doble clic. No necesita servidor ni instalación.

---

## Cómo está armada

Al entrar se ven **tres escenas** seguidas:

1. **El sobre** — se toca y se abre (solapa con forro dorado, sello de lacre M&D).
2. **La carta** — la invitación formal. Pasa sola a los 8 s o con el botón.
3. **La invitación completa**, en este orden:

| # | Sección | Qué muestra |
|---|---|---|
| 1 | Portada | Nombres, fecha y hora |
| 2 | Frase | La cita de los novios |
| 3 | Nuestros Padres | Los cuatro nombres |
| 4 | Cuenta regresiva | Días/horas/min/seg + **Agregar al calendario** |
| 5 | Dónde y cuándo | Ceremonia y recepción, con botón de mapa |
| 6 | Itinerario del día | Cronología por horas |
| 7 | Código de vestimenta | Formal, tonos oscuros |
| 8 | Solo adultos | La nota sobre los niños |
| 9 | Galería | Carrusel deslizable de la propuesta |
| 10 | Lluvia de sobres | En lugar de regalos |
| 11 | Confirmación | Nombre → WhatsApp |

Abajo queda fija la **barra de navegación**: Inicio · Lugar · Fotos · Confirmar.

---

## ⚠️ Datos que faltan por poner

En `index.html` todos están marcados con un comentario `<!-- ⚠️ EDITAR ... -->`.

| Dato | Dónde |
|---|---|
| Nombre y dirección de la **iglesia** | `index.html`, sección 5 (y también en la carta) |
| Nombre y dirección del **salón** | `index.html`, sección 5 |
| **Enlaces de Google Maps** | los `href="#"` de los botones "Cómo llegar" |
| **Hora real** (hoy dice 4:00 PM) | `index.html` (portada, carta, sección 5) y `CONFIG.fechaBoda` |
| **Horas del itinerario** | `index.html`, sección 6 |
| **Apellidos completos de los padres** | `index.html`, sección 3 |
| **Lugar para el calendario** | `js/main.js` → `CONFIG.evento.lugar` |
| **La canción** | ponerla en `musica/cancion.mp3` |

### Ya confirmado
- Fecha: **sábado 31 de julio de 2027**
- WhatsApp de confirmaciones: **+57 310 409 9711**
- Vestimenta: **formal, tonos oscuros**
- **Solo adultos**

La fecha aparece escrita en 5 lugares de `index.html` (tarjeta del sobre, carta ×2,
portada y pie) más `CONFIG.fechaBoda` en `js/main.js`, que es la que mueve la cuenta
regresiva y el botón de calendario.

---

## Estructura de archivos

```
index.html            la invitación completa
css/styles.css        todos los estilos (paleta en :root, arriba del todo)
js/main.js            configuración + animaciones + carrusel + RSVP
fotos/                foto-01 … foto-10 (la propuesta)
musica/cancion.mp3    canción de fondo (opcional, hay que agregarla)
hoja-de-calculo/      cómo conectar las confirmaciones con la lista
```

## Cambiar cosas comunes

**Colores** → variables en `css/styles.css`, líneas 9-30.
Cambiando `--gold`, `--beige` y `--cream` cambia toda la invitación.

**Fotos** → reemplaza los archivos de `fotos/` conservando los nombres.
Los textos y el encuadre de cada una están en `PHOTOS`, en `js/main.js`.
Si a alguna le queda cortada la cara, súbele o bájale el `pos`
(0% = arriba de la foto, 100% = abajo).

**Tonos del código de vestimenta** → los círculos de colores están en
`index.html`, en `.dress-swatches`.

## Confirmaciones

El invitado escribe su nombre, dice **cuántos vienen con él y cómo se llaman**, y
puede dejar un mensaje. Al darle "Confirmar asistencia" pasan **dos cosas a la vez**:

1. Se guarda una fila en la hoja de cálculo (nombre, acompañantes, total y mensaje).
2. Se abre WhatsApp con el mensaje ya redactado hacia `CONFIG.whatsapp`.

✅ **La hoja ya está conectada y funcionando** (probado el 13/08/2026).
La URL está en `js/main.js` → `CONFIG.sheetsUrl`.

Si algún día editas el código de Apps Script, acuérdate de
**Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión**,
o los cambios no se aplican. Los detalles están en
`hoja-de-calculo/INSTRUCCIONES.md`.

## Publicarla en internet (Railway)

Ya está publicada en:

**https://invitacion-miguel-daniela-production.up.railway.app**

El código está en **https://github.com/jquinteroh2-ops/Invitaci-n-especial-**
(repositorio privado).

### Volver a subir cambios
Railway está conectado al repositorio, así que **basta con hacer push**.
Cada vez que edites algo (textos, fotos, la hora, los mapas), desde esta carpeta:

```
git add -A
git commit -m "lo que cambiaste"
git push
```

Railway detecta el push solo y en ~1 minuto la página queda actualizada.
No hay que correr nada más.

> Si alguna vez quieres publicar sin pasar por GitHub, `railway up` sigue
> funcionando: sube la carpeta tal como está en tu computador.

### Cómo funciona
- `package.json` y `server.js` son solo para Railway: sirven los archivos de esta
  carpeta. No tocan la invitación ni hay que instalarles nada.
- `hoja-de-calculo/`, `LEEME.md` y `server.js` no se sirven al público.
- Si quieres un dominio propio (ej. `miguelydaniela.com`), se agrega en
  Railway → el servicio → *Settings* → *Networking* → *Custom Domain*.
