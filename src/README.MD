## 📗 README – Backend de Link2Play

**Ruta:** `link2play-backend/README.md`  
**Versión:** 1.0.0  
**Parte:** Backend (Node.js + Express)

---

### 🔧 Descripción del Proyecto

Este backend da soporte a la plataforma **Link2Play**, gestionando usuarios, perfiles, partidas, eventos y conexiones entre jugadores. Está construido con **Node.js + Express** y utiliza **MongoDB con Mongoose** como base de datos. Además, incluye autenticación JWT, middlewares personalizados y estructura modular.

---

### 🛠️ Tecnologías Utilizadas

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT (jsonwebtoken)** para autenticación segura
- **dotenv** para variables de entorno
- **cors**, **morgan**, **bcryptjs**, etc.
- **nodemon** (solo en desarrollo)

---

### 📁 Estructura del Proyecto

```
link2play-backend/
├── controllers/       # Lógica de cada recurso (usuarios, tareas, eventos...)
├── routes/            # Definición de endpoints por recurso
├── models/            # Esquemas de Mongoose (User, Match, Event, etc.)
├── middlewares/       # Autenticación, validaciones, errores
├── utils/             # Funciones auxiliares
├── config/            # Conexión a MongoDB y variables globales
├── .env               # Variables privadas del entorno
├── index.js           # Punto de entrada principal
```

---

### ⚙️ Configuración Inicial

#### 1. Instalar dependencias

```bash
cd link2play-backend
npm install
```

#### 2. Crear archivo `.env` en la raíz

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/link2play
JWT_SECRET=tu_clave_secreta
```

#### 3. Levantar el servidor en modo desarrollo

```bash
npx nodemon index.js
```

---

### 🔐 Autenticación con JWT

- Los usuarios se registran y loguean con email y contraseña
- Se genera un `token` firmado con `JWT_SECRET`
- El token se incluye en las peticiones privadas vía `Authorization: Bearer <token>`
- Un middleware (`authMiddleware`) protege rutas privadas

---

### 🌍 Endpoints principales (ejemplos)

| Método | Ruta              | Descripción                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | `/users/register` | Registro de usuario nuevo          |
| POST   | `/users/login`    | Inicio de sesión                   |
| GET    | `/users/profile`  | Perfil del usuario autenticado     |
| GET    | `/games`          | Lista de juegos disponibles        |
| POST   | `/events`         | Crear nuevo evento o partida (LFG) |
| GET    | `/events`         | Buscar eventos disponibles         |
| POST   | `/match/invite`   | Invitar a otro jugador a jugar     |
| POST   | `/rating/:userId` | Valorar a un jugador tras partida  |

> La lista completa se encuentra en `/routes/` y puede ampliarse en futuras versiones.

---

### 🧪 Validaciones y Middlewares

- Validación de campos obligatorios con middlewares
- Manejo de errores centralizado
- Control de permisos y usuarios autenticados
- Limpieza y separación de responsabilidades

---

### 📦 Futuras mejoras backend

- Rate limit y protección contra spam
- Sistema de logs y auditoría de acciones
- Panel admin para moderadores
- Notificaciones push

---

### 👥 Créditos

Backend desarrollado por el **Equipo Azul**.  
Todos los derechos reservados. Proyecto privado.

👥 Equipo Azul

Salva

Lidia

Giú

Adrián

Toomaj
