<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CoinVoyage API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>

  <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: "https://api.coinvoyage.io/openapi.json",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        docExpansion: "full",        // expand tags + operations by default :contentReference[oaicite:1]{index=1}
        deepLinking: true,           // optional, enables direct links to operations :contentReference[oaicite:2]{index=2}
        defaultModelsExpandDepth: -1 // hides the models section if you want a cleaner view
      });

      window.ui = ui;
    }
  </script>
</body>
</html>