// test.ts
import faftch from "./src/index.js"; // Apunta al punto de entrada compilado o fuente
import { FAFTchError } from "./src/FAFTchError.js";
async function runTests() {
    console.log("=== 🚀 INICIANDO PRUEBAS DE FAFTCH ===\n");
    // ----------------------------------------------------
    // TEST 1: Petición Exitosa (Instancia Global)
    // ----------------------------------------------------
    try {
        console.log("Test 1: Probando GET con instancia global...");
        const response = await faftch.get("https://jsonplaceholder.typicode.com/posts/1");
        console.log(`✅ Éxito! Status: ${response.status}`);
        console.log(`Payload recibido (ID): ${response.data.id}\n`);
    }
    catch (error) {
        console.error("❌ Test 1 Falló:", error);
    }
    // ----------------------------------------------------
    // TEST 2: Creación de Instancia Personalizada (.create)
    // ----------------------------------------------------
    try {
        console.log("Test 2: Creando instancia con baseUrl personalizada...");
        const api = faftch.create({
            baseUrl: "https://jsonplaceholder.typicode.com",
            headers: { "X-Custom-Header": "FAFTchClient" }
        });
        const response = await api.get("/posts/2");
        console.log(`✅ Éxito Instancia! Status: ${response.status}`);
        console.log(`Payload recibido (ID): ${response.data.id}\n`);
    }
    catch (error) {
        console.error("❌ Test 2 Falló:", error);
    }
    // ----------------------------------------------------
    // TEST 3: Simulación de Timeout Automático (AbortController)
    // ----------------------------------------------------
    try {
        console.log("Test 3: Forzando un Timeout (Límite: 50ms en petición lenta)...");
        // Forzamos un retraso usando una API que tarda en responder deliberadamente
        await faftch.get("https://httpbin.org/delay/2", { timeout: 50 });
        console.log("❌ Error: La petición debió abortarse pero terminó.");
    }
    catch (error) {
        if (error instanceof FAFTchError && error.context?.isTimeout) {
            console.log(`✅ Éxito! El Timeout funcionó perfectamente.`);
            console.log(`Mensaje controlado: "${error.message}"\n`);
        }
        else {
            console.error("❌ Test 3 Falló con un error inesperado:", error);
        }
    }
    // ----------------------------------------------------
    // TEST 4: Mecanismo de Reintentos Automáticos (Errores 5xx)
    // ----------------------------------------------------
    try {
        console.log("Test 4: Evaluando el motor de reintentos con un estatus 500...");
        console.log("(Deberías ver en los logs de tu retryEngine los intentos suceder)");
        await faftch.get("https://httpbin.org/status/500", {
            retry: { maxAttempts: 3, delay: 500 }
        });
        console.log("❌ Error: El servidor devolvió 500 pero no lanzó excepción.");
    }
    catch (error) {
        if (error instanceof FAFTchError && error.status === 500) {
            console.log(`\n✅ Éxito! El motor agotó los 3 intentos y finalmente lanzó el error.`);
            console.log(`Status final capturado en catch: ${error.status} (${error.statusText})\n`);
        }
        else {
            console.error("❌ Test 4 Falló:", error);
        }
    }
    console.log("=== 🏁 PRUEBAS FINALIZADAS ===");
}
runTests();
//# sourceMappingURL=test.js.map