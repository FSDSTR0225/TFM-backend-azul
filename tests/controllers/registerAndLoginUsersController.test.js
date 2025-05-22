import app from "../../src/app";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";

describe("User Routes Integration Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // Desconectar y cerrar MongoDB después de las pruebas
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpiar las colecciones antes de cada prueba
    await mongoose.connection.dropDatabase();
  });

  // Pruebas para el endpoint de registro
  describe("POST /auth/register", () => {
    it("Deberia registrar un nuevo usuario", async () => {
      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "test@gmail.com",
        password: "testpassword",
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Usuario registrado correctamente"
      );
      expect(response.body).toHaveProperty("user");

      const User = mongoose.model("User");
      const user = await User.findOne({ email: "test@gmail.com" });
      expect(user.username).toBe("testuser");
      expect(user.email).toBe("test@gmail.com");
    });
    it("Deberia retornar una error 400 si no hay password", async () => {
      const response = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "test@gmail.com",
      });
      expect(response.status).toBe(400);

      const User = mongoose.model("User");
      const user = await User.findOne({ email: "test@gmail.com" });
      expect(user).toBeNull();
    });
  });

  // Pruebas para el endpoint de inicio de sesión

  it("Debería iniciar sesión correctamente con email", async () => {
    const userData = {
      username: "testuser",
      email: "test@gmail.com",
      password: "contraseña123",
    };
    const resRegister = await request(app)
      .post("/auth/register")
      .send(userData);

    expect(resRegister.status).toBe(201);
    expect(resRegister.body).toHaveProperty(
      "message",
      "Usuario registrado correctamente"
    );
    expect(resRegister.body).toHaveProperty("user");

    const User = mongoose.model("User");
    const user = await User.findOne({ email: userData.email });
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);

    // Step 2: Intenta hacer login con ese usuario usando POST a /api/users/login

    const resLogin = await request(app).post("/auth/login").send({
      login: "test@gmail.com", // tambien puedes usar "testuser" como username
      password: userData.password,
    });

    // Step 3: Verifica:
    expect(resLogin.statusCode).toBe(200);
    expect(resLogin.body).toHaveProperty("access_token");
    expect(resLogin.body).toHaveProperty("token_type", "Bearer");
    expect(resLogin.body).toHaveProperty("user");
  });

  test("No debería iniciar sesión con credenciales incorrectas", async () => {
    // Step 1: Registra un usuario nuevo
    const userData = {
      username: "testuser",
      email: "test@gmail.com",
      password: "contraseña123",
    };
    const resRegister = await request(app)
      .post("/auth/register")
      .send(userData);

    expect(resRegister.status).toBe(201);
    expect(resRegister.body).toHaveProperty(
      "message",
      "Usuario registrado correctamente"
    );
    expect(resRegister.body).toHaveProperty("user");

    const User = mongoose.model("User");
    const user = await User.findOne({ email: userData.email });
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    // Step 2: Intenta login con la contraseña incorrecta

    const resLogin = await request(app).post("/auth/login").send({
      login: "test@gmail.com", // tambien puedes usar "testuser" como username
      password: "contraseñaIncorrecta",
    });
    // Step 3: Verifica error 401 y mensaje 'Contraseña incorrecta'
    expect(resLogin.statusCode).toBe(401);
    expect(resLogin.body).toHaveProperty("message", "Contraseña incorrecta");
  });

  test("Debería obtener el perfil del usuario autenticado", async () => {
    const userData = {
      username: "testuser",
      email: "test@gmail.com",
      password: "contraseña123",
    };
    const resRegister = await request(app)
      .post("/auth/register")
      .send(userData);

    expect(resRegister.status).toBe(201);
    expect(resRegister.body).toHaveProperty(
      "message",
      "Usuario registrado correctamente"
    );
    expect(resRegister.body).toHaveProperty("user");

    const User = mongoose.model("User");
    const user = await User.findOne({ email: userData.email });
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);

    // Step 2: Intenta hacer login con ese usuario usando POST a /api/users/login

    const resLogin = await request(app).post("/auth/login").send({
      login: "test@gmail.com", // tambien puedes usar "testuser" como username
      password: userData.password,
    });

    // Step 3: Verifica:
    expect(resLogin.statusCode).toBe(200);
    expect(resLogin.body).toHaveProperty("access_token");
    expect(resLogin.body).toHaveProperty("token_type", "Bearer");
    expect(resLogin.body).toHaveProperty("user");
    const token = resLogin.body.access_token; // Guardamos el token para usarlo en la siguiente petición
    console.log("TOKEN:", token);
    // Step 3: Hacer GET con Authorization
    const resProfile = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);

    // Step 4: Verificar respuesta
    expect(resProfile.status).toBe(200);
    expect(resProfile.body).toHaveProperty("user");
    expect(resProfile.body.user).toHaveProperty("username", userData.username);
    expect(resProfile.body.user).toHaveProperty("email", userData.email);
  });
});
