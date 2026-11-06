# Demo — Brasa & Barrio

Prototipo funcional de **Menuly**: menú digital, carrito y pedido enviado a WhatsApp. No necesita backend ni instalación.

> **Estado:** demo de portafolio, no producto de producción. La marca, la dirección y los datos de contacto son ficticios.

## Cómo verlo

Opción 1: abre `index.html` en el navegador.

Opción 2, con servidor local (desde la raíz `Trabajo`):

```bash
cd menuly/demo
npx serve .
```

Abre la URL que muestre la terminal (normalmente `http://localhost:3000`).

## Qué demuestra

- Menú por categorías con platos agotados.
- Carrito con cantidades y persistencia en `localStorage`.
- Checkout con retiro o delivery.
- Validación de campos.
- Vista previa del mensaje de WhatsApp con detalle, total y datos del cliente.
- Diseño responsive y accesible.

## Modo demo (importante)

En `app.js`:

```js
const CONFIG = {
  restaurantName: "Brasa & Barrio",
  whatsapp: "584120000000", // ← tu número real, sin + ni espacios
  currency: "$",
  demoMode: true,
};
```

- **`demoMode: true`** → el botón muestra una vista previa del pedido. No abre WhatsApp ni envía nada a nadie. Ideal para una demo pública.
- **`demoMode: false`** → el botón abre WhatsApp con el pedido. Úsalo solo con un número real que tú controles y, preferiblemente, en una copia privada para un cliente.

## ¿Datos reales o ficticios?

**Para la demo pública: ficticios.** No uses el nombre, logo, dirección, teléfono ni Instagram de un restaurante real sin permiso escrito. Puede interpretarse como suplantación, el negocio puede recibir mensajes que no le corresponden y no puedes presentar su marca como tu trabajo.

**Para una venta privada:** puedes personalizar una copia con los datos del prospecto, pero:

1. Hazlo solo después de hablar con él y pedir permiso para usar su nombre/logo.
2. No la publiques en internet ni la indexes.
3. Etiquétala como "propuesta" o "demo no oficial".
4. Si el cliente contrata, recién ahí se convierte en un proyecto real.

**Para un caso de estudio:** usa datos reales solo con permiso escrito y después de entregar. Si no tienes permiso, anonimiza: "una cadena de cafeterías en tu ciudad" y aclara que las métricas son de ejemplo.

## Personalización rápida

En `app.js`:

```js
const CONFIG = {
  restaurantName: "Brasa & Barrio",
  whatsapp: "584120000000",
  currency: "$",
  demoMode: true,
};
```

Luego reemplaza el arreglo `PRODUCTS` con el menú real. Cada producto necesita:

```js
{
  id: "identificador-unico",
  category: "entradas", // debe existir en CATEGORIES
  name: "Nombre del plato",
  description: "Descripción corta y apetitosa.",
  price: 8.5,
  image: image("archivo.jpg"), // dentro de assets/img
  tag: "Más pedido", // opcional
  available: true,   // false = agotado
}
```

Para cambiar colores, edita las variables al inicio de `styles.css`:

```css
:root {
  --accent: #e8622c;
  --bg: #0e0c0a;
  --cream: #f5efe6;
}
```

## Publicar el demo

Funciona en Netlify, Vercel, GitHub Pages o Cloudflare Pages. Al ser estático, solo subes la carpeta `demo/`.

Antes de publicar:

- [ ] Cambiar `CONFIG.whatsapp` por un número que controles.
- [ ] Decidir si `demoMode` queda en `true` (recomendado para demo pública).
- [ ] Revisar que la dirección, teléfono e Instagram sigan siendo ficticios.
- [ ] Agregar tu nombre y enlace de portafolio en el footer.
- [ ] Quitar `<meta name="robots" content="noindex, nofollow">` si quieres que Google lo indexe.
- [ ] Probar en móvil: carrito, delivery, validación y vista previa.
- [ ] Revisar que las fotos carguen desde `assets/img`.
- [ ] Añadir una imagen OG absoluta cuando tengas dominio (ej. `https://tudominio.com/assets/img/hero.jpg`).

## Qué falta para producción

- Backend Laravel con base de datos.
- Panel de administración para menú y pedidos.
- Pedidos guardados con estados.
- Validación y cálculo de totales en servidor.
- Autenticación y autorización por restaurante.
- Hosting con HTTPS, backups y almacenamiento persistente.
- Aviso de privacidad y tratamiento de datos.
- Analítica (solo si la necesitas y con consentimiento).

Eso es exactamente lo que se construye en las semanas 2 y 3 del plan.

## Cómo se traduce a Laravel

| Demo | Laravel |
|---|---|
| `PRODUCTS` en `app.js` | Tabla `products` + `Category` |
| Carrito en `localStorage` | Sesión o carrito en cliente + validación servidor |
| `buildOrderMessage()` | `OrderController@store` + `OrderMessage` |
| `https://wa.me/...` | Igual en v1; Cloud API en v2 |
| Sin panel | Breeze + CRUD de productos y pedidos |

## Para mostrarlo en una venta

1. Abre el demo en el teléfono, no en la laptop.
2. Haz un pedido completo tú mismo mientras hablas.
3. Enseña la vista previa del mensaje (o el WhatsApp real en una copia privada).
4. Pregunta: "¿Así reciben los pedidos hoy?"
5. Cierra con: "Te lo adapto con tu menú en 5 días."

## Créditos

- Fotos: [Unsplash](https://unsplash.com/license). Ver `CREDITS.md`.
- Tipografías: Fraunces y DM Sans vía Google Fonts (SIL Open Font License).
- Código: demo propio de Menuly.
