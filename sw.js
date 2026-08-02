// Lista de claves válidas (Para producción, se recomienda migrar esto a Cloudflare KV)
const licenciasValidas = [
  { clave: "VIP-MARACAY-2026", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-001", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-099", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-088", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-100", usada: false, dispositivo: null },
  { clave: "VIP-VALENCIA-300", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-400", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-101", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-230", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-125", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-050", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-430", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-104", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-482", usada: false, dispositivo: null },
  { clave: "VIP-VALENCIA-719", usada: false, dispositivo: null },
  { clave: "VIP-MARACAIBO-325", usada: false, dispositivo: null },
  { clave: "VIP-BARQUISIMETO-691", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-833", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-215", usada: false, dispositivo: null },
  { clave: "VIP-VALENCIA-548", usada: false, dispositivo: null },
  { clave: "VIP-MERIDA-912", usada: false, dispositivo: null },
  { clave: "VIP-PUERTOORDAZ-307", usada: false, dispositivo: null },
  { clave: "VIP-BARCELONA-654", usada: false, dispositivo: null },
  { clave: "VIP-SANCRISTOBAL-189", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-503", usada: false, dispositivo: null },
  { clave: "VIP-VALENCIA-820", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-467", usada: false, dispositivo: null },
  { clave: "VIP-BARQUISIMETO-138", usada: false, dispositivo: null },
  { clave: "VIP-MARACAIBO-795", usada: false, dispositivo: null },
  { clave: "VIP-MATURIN-246", usada: false, dispositivo: null },
  { clave: "VIP-BARINAS-612", usada: false, dispositivo: null },
  { clave: "VIP-CUMANA-384", usada: false, dispositivo: null },
  { clave: "VIP-PORLAMAR-951", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-117", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-632", usada: false, dispositivo: null },
  { clave: "VIP-VALENCIA-409", usada: false, dispositivo: null },
  { clave: "VIP-CORO-826", usada: false, dispositivo: null },
  { clave: "VIP-SANFELIPE-531", usada: false, dispositivo: null },
  { clave: "VIP-GUANARE-274", usada: false, dispositivo: null },
  { clave: "VIP-LOSTEQUES-683", usada: false, dispositivo: null },
  { clave: "VIP-LAIGUAIRA-915", usada: false, dispositivo: null },
  { clave: "VIP-PUERTOCABELLO-342", usada: false, dispositivo: null },
  { clave: "VIP-ELTIGRE-789", usada: false, dispositivo: null },
  { clave: "VIP-CARORA-156", usada: false, dispositivo: null },
  { clave: "VIP-VICTORIA-498", usada: false, dispositivo: null },
  { clave: "VIP-TURMERO-623", usada: false, dispositivo: null },
  { clave: "VIP-CAGUA-847", usada: false, dispositivo: null },
  { clave: "VIP-VALERA-210", usada: false, dispositivo: null },
  { clave: "VIP-TRUJILLO-569", usada: false, dispositivo: null },
  { clave: "VIP-GUATIRE-381", usada: false, dispositivo: null },
  { clave: "VIP-GUARENAS-742", usada: false, dispositivo: null },
  { clave: "VIP-CHARALLAVE-193", usada: false, dispositivo: null },
  { clave: "VIP-ACARIGUA-605", usada: false, dispositivo: null },
  { clave: "VIP-APURE-487", usada: false, dispositivo: null },
  { clave: "VIP-TUCUPITA-921", usada: false, dispositivo: null },
  { clave: "VIP-SANCARLOS-358", usada: false, dispositivo: null },
  { clave: "VIP-PORLAMAR-174", usada: false, dispositivo: null },
  { clave: "VIP-MARACAY-996", usada: false, dispositivo: null },
  { clave: "VIP-CARACAS-520", usada: false, dispositivo: null },
  { clave: "VIP-VALENCIA-311", usada: false, dispositivo: null },
  { clave: "VIP-BARQUISIMETO-874", usada: false, dispositivo: null },
  { clave: "VIP-MARACAIBO-608", usada: false, dispositivo: null }
];

export default {
  async fetch(request, env, ctx) {
    // Permitir CORS para que tu PWA pueda comunicarse sin bloqueos
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Manejar peticiones pre-flight de CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Solo aceptar peticiones POST en la ruta /api/verify
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/api/verify") {
      try {
        const body = await request.json();
        const { licenseKey, deviceId } = body;

        const licencia = licenciasValidas.find(l => l.clave === licenseKey);

        if (!licencia) {
          return new Response(JSON.stringify({ success: false, message: "La clave introducida no existe." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        if (licencia.usada && licencia.dispositivo !== deviceId) {
          return new Response(JSON.stringify({ success: false, message: "Esta clave ya está en uso en otro dispositivo." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Marcar como usada y asociar dispositivo
        licencia.usada = true;
        licencia.dispositivo = deviceId;

        // CORREGIDO: Se elimina la duplicidad conflictiva de "success"
        return new Response(JSON.stringify({ success: true, message: "Licencia activada correctamente." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Error al procesar la solicitud." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    return new Response("Ruta no encontrada o método no permitido", { status: 404, headers: corsHeaders });
  }
};
// Si la ruta no coincide, devolver un JSON de error 404 (NUNCA texto plano)
    return new Response(JSON.stringify({ success: false, message: "Ruta de API no encontrada en el servidor." }), { 
        status: 404, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
};
