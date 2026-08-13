# Cómo conectar las confirmaciones con la hoja de cálculo

Son 10 minutos, una sola vez. Es gratis y no hay que instalar nada.

> **Nota:** se usa **Google Sheets**, no Excel de escritorio. Es lo que permite
> que la página web escriba sola en la hoja. Cuando quieras el archivo de Excel,
> le das *Archivo → Descargar → Microsoft Excel (.xlsx)* y listo.

---

## Paso 1 · Crear la hoja

1. Entra a **[sheets.google.com](https://sheets.google.com)** con tu cuenta de Google.
2. Crea una hoja en blanco.
3. Ponle un nombre, por ejemplo **Confirmaciones Boda Miguel y Daniela**.

No tienes que crear columnas ni nada: el código las crea solo.

---

## Paso 2 · Pegar el código

1. En esa misma hoja, arriba, entra a **Extensiones → Apps Script**.
2. Se abre una pestaña nueva con un editor de código que dice algo como
   `function myFunction() { }`.
3. **Borra todo** lo que haya ahí.
4. Abre el archivo `codigo.gs` (está en esta misma carpeta), copia **todo**
   su contenido y pégalo en el editor.
5. Dale al ícono de **guardar** (💾) o `Ctrl + S`.

---

## Paso 3 · Probarlo antes de publicar

1. Arriba del editor hay una lista desplegable de funciones.
   Elige **`probar`**.
2. Dale al botón **▶ Ejecutar**.
3. La primera vez Google te pide permisos:
   - *Revisar permisos* → elige tu cuenta
   - Si sale **"Google no ha verificado esta aplicación"**:
     → *Configuración avanzada* → *Ir a (nombre del proyecto) (no seguro)*
   - → **Permitir**

   Esto es normal: le estás dando permiso a **tu propio** código para escribir
   en **tu propia** hoja.
4. Vuelve a la hoja de cálculo. Deben haber aparecido dos pestañas nuevas:
   **Confirmaciones** (con una fila de prueba) y **Resumen**.

Si ves eso, vas bien. Borra la fila de prueba cuando quieras.

---

## Paso 4 · Publicarlo

1. En el editor de Apps Script, arriba a la derecha:
   **Implementar → Nueva implementación**.
2. Dale al engranaje ⚙ junto a *Seleccionar tipo* y elige
   **Aplicación web**.
3. Llena así:

   | Campo | Qué poner |
   |---|---|
   | Descripción | `Confirmaciones` |
   | Ejecutar como | **Yo** (tu correo) |
   | Quién tiene acceso | **Cualquier usuario** |

   ⚠️ El más importante es el último: tiene que decir **Cualquier usuario**.
   Si dice "Solo yo", los invitados no van a poder confirmar.

4. **Implementar** → **Autorizar acceso** si lo vuelve a pedir.
5. Te muestra una **URL de la aplicación web**, algo así:

   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxx/exec
   ```

   **Cópiala.**

---

## Paso 5 · Pegarla en la invitación

1. Abre el archivo `js/main.js` de la invitación.
2. Arriba de todo, en el bloque `CONFIG`, busca la línea:

   ```js
   sheetsUrl : '',
   ```

3. Pega la URL entre las comillas:

   ```js
   sheetsUrl : 'https://script.google.com/macros/s/AKfycbxxxx.../exec',
   ```

4. Guarda el archivo.

---

## Paso 6 · Probar de verdad

1. Abre la invitación, baja hasta **¿Nos acompañas?**
2. Escribe un nombre, agrega un acompañante y dale **Confirmar asistencia**.
3. Deben pasar **dos cosas**:
   - Se abre WhatsApp con el mensaje listo para enviar.
   - En la hoja aparece la fila nueva (refresca la pestaña).

Si la fila no aparece, mira **Qué hacer si algo falla**, abajo.

---

## Qué vas a ver en la hoja

**Pestaña "Confirmaciones"** — una fila por cada persona que confirma:

| Fecha y hora | Nombre | Acompañantes | Total personas | Mensaje para los novios |
|---|---|---|---|---|
| 12/08/2026 9:41 PM | Jose Quintero | María Pérez, Luis Quintero | 3 | ¡Felicidades! Ahí estaremos |

**Pestaña "Resumen"** — se actualiza sola:

- Confirmaciones recibidas (cuántas personas llenaron el formulario)
- Personas en total (sumando acompañantes) ← **este es el número para la comida**
- Última confirmación

---

## Descargarla como Excel

*Archivo → Descargar → Microsoft Excel (.xlsx)*

---

## Qué hacer si algo falla

**No aparece ninguna fila**
- Revisa que en el Paso 4 hayas puesto *Quién tiene acceso: **Cualquier usuario***.
- Revisa que la URL en `main.js` termine en **`/exec`** (no en `/dev`).
- Revisa que la URL esté entre comillas y con la coma al final.

**Cambié el código y ya no guarda**
- Cada vez que edites el código tienes que ir a
  **Implementar → Gestionar implementaciones → ✏️ editar → Versión: Nueva versión → Implementar**.
  Si creas una implementación nueva desde cero, la URL cambia y hay que
  volver a pegarla en `main.js`.

**Quiero ver los errores**
- En Apps Script, menú lateral izquierdo → **Ejecuciones**. Ahí sale cada
  llamada que llegó y si falló.

---

## Un par de cosas que conviene saber

- **El WhatsApp es tu respaldo.** La invitación siempre abre WhatsApp, así que
  aunque la hoja fallara, la confirmación igual te llega por ahí.
- **La hoja es privada.** Solo la ve quien tú compartas. La página web solo
  puede *agregar* filas, no leerlas.
- **Si alguien confirma dos veces** salen dos filas. Al final revisa que no
  haya nombres repetidos antes de cuadrar las mesas.
