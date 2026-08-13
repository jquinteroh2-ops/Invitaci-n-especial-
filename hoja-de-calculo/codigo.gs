/**
 * ═══════════════════════════════════════════════════════════════
 *  LISTA DE CONFIRMACIONES · Boda Miguel & Daniela
 *
 *  Este código va PEGADO dentro de la hoja de cálculo de Google.
 *  Las instrucciones paso a paso están en INSTRUCCIONES.md
 * ═══════════════════════════════════════════════════════════════
 */

// Nombre de la pestaña donde se guardan las confirmaciones.
var HOJA = 'Confirmaciones';

var COLUMNAS = [
  'Fecha y hora',
  'Nombre',
  'Acompañantes',
  'Total personas',
  'Mensaje para los novios'
];


/** Se ejecuta cada vez que alguien confirma en la invitación. */
function doGet(e) {
  var respuesta = { ok: false };

  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var nombre = String(p.nombre || '').trim();

    if (!nombre) {
      respuesta.error = 'Falta el nombre';
    } else {
      guardarFila({
        nombre       : nombre,
        acompanantes : String(p.acompanantes || '').trim(),
        total        : Number(p.total) || 1,
        mensaje      : String(p.mensaje || '').trim()
      });
      respuesta.ok = true;
    }
  } catch (err) {
    respuesta.error = String(err);
  }

  return ContentService
    .createTextOutput(JSON.stringify(respuesta))
    .setMimeType(ContentService.MimeType.JSON);
}


/** Agrega la fila y deja la hoja bonita. */
function guardarFila(d) {
  var hoja = obtenerHoja();

  hoja.appendRow([
    new Date(),
    d.nombre,
    d.acompanantes,
    d.total,
    d.mensaje
  ]);

  var fila = hoja.getLastRow();

  // formato de la fila nueva
  hoja.getRange(fila, 1).setNumberFormat('dd/MM/yyyy  hh:mm AM/PM');
  hoja.getRange(fila, 4).setHorizontalAlignment('center');
  hoja.getRange(fila, 1, 1, COLUMNAS.length)
      .setVerticalAlignment('top')
      .setWrap(true);

  actualizarResumen(hoja);
}


/** Crea la pestaña con sus encabezados la primera vez. */
function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja  = libro.getSheetByName(HOJA);

  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
  }

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    hoja.getRange(1, 1, 1, COLUMNAS.length)
        .setFontWeight('bold')
        .setBackground('#F1E7D6')
        .setFontColor('#4A3C2C')
        .setVerticalAlignment('middle');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(1, 165);  // fecha
    hoja.setColumnWidth(2, 220);  // nombre
    hoja.setColumnWidth(3, 300);  // acompañantes
    hoja.setColumnWidth(4, 110);  // total
    hoja.setColumnWidth(5, 380);  // mensaje
  }

  return hoja;
}


/** Escribe el total de invitados confirmados en una pestaña "Resumen". */
function actualizarResumen(hoja) {
  var libro   = SpreadsheetApp.getActiveSpreadsheet();
  var resumen = libro.getSheetByName('Resumen');

  if (!resumen) {
    resumen = libro.insertSheet('Resumen');
    resumen.getRange('A1').setValue('RESUMEN DE CONFIRMACIONES')
           .setFontWeight('bold').setFontSize(13).setFontColor('#4A3C2C');
    resumen.getRange('A3').setValue('Confirmaciones recibidas');
    resumen.getRange('A4').setValue('Personas en total');
    resumen.getRange('A6').setValue('Última confirmación');
    resumen.getRange('A3:A6').setFontWeight('bold');
    resumen.setColumnWidth(1, 220);
    resumen.setColumnWidth(2, 200);
  }

  var filas = Math.max(0, hoja.getLastRow() - 1);
  var total = 0;
  if (filas > 0) {
    hoja.getRange(2, 4, filas, 1).getValues()
        .forEach(function (r) { total += Number(r[0]) || 0; });
  }

  resumen.getRange('B3').setValue(filas);
  resumen.getRange('B4').setValue(total);
  resumen.getRange('B6').setValue(new Date())
         .setNumberFormat('dd/MM/yyyy  hh:mm AM/PM');
}


/**
 * PRUEBA: dale al botón ▶ con esta función seleccionada para
 * comprobar que todo funciona antes de publicar. Debe aparecer
 * una fila de prueba en la hoja.
 */
function probar() {
  guardarFila({
    nombre       : 'Invitado de prueba',
    acompanantes : 'Acompañante de prueba',
    total        : 2,
    mensaje      : 'Si ves esta fila, la hoja quedó bien configurada. Ya la puedes borrar.'
  });
}
