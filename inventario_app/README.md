# Inventario - Ferretería (UI demo)

Archivos:

- index.html — interfaz principal
- styles.css — estilos
- app.js — lógica de render, filtros y modal

Cómo usar:

1. Abrir `inventario_app/index.html` en el navegador.
   - Si el navegador bloquea recursos por `file://`, sirve la carpeta con un servidor estático:

```bash
# usando Python 3 (desde la carpeta Inventario)
python -m http.server 8000
# luego abrir http://localhost:8000/inventario_app/index.html
```

2. Buscar, ordenar o filtrar. Hacer clic en una tarjeta para ver detalles.

Si quieres añadir persistencia (guardar inventario en localStorage o en un backend), lo implemento.
