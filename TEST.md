# CoinVoyage API Reference

Below is the live Swagger UI view of the CoinVoyage OpenAPI specification.  
All endpoints are expanded by default for easier browsing.

<div style="width:100%; height:90vh; border:none;">
  <iframe
    srcdoc='
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>CoinVoyage API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
        <style>
          html, body { margin:0; padding:0; height:100%; background:#fff; }
          #swagger-ui { height:100%; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = () => {
            const ui = SwaggerUIBundle({
              url: "https://api.coinvoyage.io/openapi.json",
              dom_id: "#swagger-ui",
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              docExpansion: "full",
              deepLinking: true,
              defaultModelsExpandDepth: -1
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>'
    width="100%"
    height="100%"
    style="border:none;"
  ></iframe>
</div>
