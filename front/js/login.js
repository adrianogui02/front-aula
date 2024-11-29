const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`http://localhost:3000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Corpo da requisição convertido para JSON
    });

    // Verifique se a resposta contém o corpo esperado
    const data = await response.json(); // Tenta acessar o corpo da resposta
    if (!data.token) {
      throw new Error("Credenciais Inválidas");
    }

    const { token, user } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("userId", Number(user.id));
    window.location.href = "products.html"; // Redireciona após o login bem-sucedido
  } catch (error) {
    // Exibe o erro, caso ocorra
    alert(error.message || "Erro ao logar. Verifique suas credenciais.");
  }
});
