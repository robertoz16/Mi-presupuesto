// Mostrar animación de bienvenida por 3 segundos
window.onload = function() {
  const bienvenida = document.getElementById("bienvenida");
  const menu = document.getElementById("menu");

  setTimeout(() => {
    bienvenida.style.display = "none";
    menu.style.display = "block";
  }, 3000); // 3 segundos
};

// Funciones para redirigir
function irAGastos() {
  window.location.href = "gastos.html";
}

function irACalculadora() {
  window.location.href = "calculadora.html";
}

function irAAhorro() {
  window.location.href = "ahorro.html";
}

function irACalendario() {
  window.location.href = "calendario.html";
}

// 👇 Funciones adicionales para ahorro.html (no afectan otras secciones)

// Asegúrate de declarar esto en ahorro.html también:
let historial = [];

// Muestra/oculta el historial de movimientos
function toggleHistorial() {
  const historialDiv = document.getElementById('ahorro-historial');
  historialDiv.style.display = (historialDiv.style.display === 'none') ? 'block' : 'none';
}

// Muestra resumen mensual agrupado por mes/año
function mostrarResumenMensual() {
  const resumenDiv = document.getElementById('ahorro-resumen');
  if (!resumenDiv) return;

  if (resumenDiv.style.display === 'block') {
    resumenDiv.style.display = 'none';
    return;
  }

  const agrupado = {};
  historial.forEach(entry => {
    const fecha = new Date(entry.fecha);
    const clave = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    agrupado[clave] = (agrupado[clave] || 0) + entry.cantidad;
  });

  resumenDiv.innerHTML = "<strong>📊 Resumen por Mes:</strong><br>" +
    Object.entries(agrupado).sort().map(([mes, total]) =>
      `📌 <strong>${mes}</strong>: $${total.toFixed(2)}`
    ).join("<br>");

  resumenDiv.style.display = 'block';
}

// Exporta el historial a un archivo CSV
function exportarCSV() {
  if (historial.length === 0) return;

  const encabezados = "Cantidad,Fecha\n";
  const filas = historial.map(e => `${e.cantidad},${e.fecha}`).join("\n");
  const contenido = encabezados + filas;

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "historial_ahorro.csv";
  enlace.style.display = "none";
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
}
function exportarPDF() {
  if (historial.length === 0) return;

  const nuevaVentana = window.open('', '', 'width=800,height=600');
  let html = `
    <html>
      <head>
        <title>Historial de Ahorro</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border-bottom: 1px solid #ccc; text-align: left; }
        </style>
      </head>
      <body>
        <h2>Historial de Ahorro</h2>
        <table>
          <tr><th>Cantidad</th><th>Fecha</th></tr>`;

  historial.forEach(entry => {
    html += `<tr><td>$${entry.cantidad.toFixed(2)}</td><td>${entry.fecha}</td></tr>`;
  });

  html += `</table>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          }
        <\/script>
      </body>
    </html>`;

  nuevaVentana.document.open();
  nuevaVentana.document.write(html);
  nuevaVentana.document.close();
}