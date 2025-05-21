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
});

// Pruebas para el endpoint de inicio de sesión

it("Debería iniciar sesión correctamente con email", async () => {
  // Registramos al usuario
  await request(app).post("/auth/register").send({
    username: "testuser",
    email: "test@mail.com",
    password: "testpassword",
  });

  // Iniciamos sesión con el email
  const response = await request(app).post("/auth/login").send({
    login: "test@mail.com",
    password: "testpassword",
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty(
    "message",
    "Sesión iniciada correctamente"
  );
  expect(response.body).toHaveProperty("token");
  expect(response.body).toHaveProperty("user");
  expect(response.body.user).toHaveProperty("username", "testuser");
  expect(response.body.user).toHaveProperty("email", "test@mail.com");
});

it("Debería iniciar sesión correctamente con username", async () => {
  await request(app).post("/auth/register").send({
    username: "anotheruser",
    email: "another@mail.com",
    password: "testpassword",
  });

  const response = await request(app).post("/auth/login").send({
    login: "anotheruser",
    password: "testpassword",
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty(
    "message",
    "Sesión iniciada correctamente"
  );
  expect(response.body.user).toHaveProperty("username", "anotheruser");
  expect(response.body.user).toHaveProperty("email", "another@mail.com");
});
