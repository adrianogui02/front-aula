import { API_URL } from "../config/env.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Erro no cadastro");

    alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Erro ao cadastrar. Tente novamente.");
  }
});
