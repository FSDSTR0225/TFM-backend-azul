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
