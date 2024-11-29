const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");
const token = localStorage.getItem("token");
const userEmailSpan = document.getElementById("userEmail");
const editProductId = document.getElementById("editProductId"); // Adicionando um campo para armazenar o ID do produto

if (!token) {
  alert("Você precisa estar logado!");
  window.location.href = "index.html";
}

const userId = localStorage.getItem("userId");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

async function fetchProducts() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${userId}`,
      {
        headers,
      }
    );
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

async function createProduct(product) {
  try {
    const response = await fetch(`http://localhost:3000/api/products`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...product,
        userId: parseInt(userId, 10), // Convertendo userId para inteiro
      }),
    });

    if (response.ok) {
      fetchProducts(); // Atualiza a lista de produtos
    }
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (response.ok) {
      fetchProducts(); // Atualiza a lista de produtos
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
  }
}

async function editProduct(productId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`,
      { method: "PUT", headers }
    );
    const product = await response.json();

    // Preencher o formulário com os dados do produto
    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;
    document.getElementById("stock").value = product.stock;

    // Preencher o campo oculto com o ID do produto
    document.getElementById("editProductId").value = product.id;

    // Alterar o texto do botão para "Editar Produto"
    document.querySelector("button[type='submit']").textContent =
      "Editar Produto";
  } catch (error) {
    console.error("Erro ao buscar produto para editar:", error);
  }
}

function renderProducts(products) {
  productList.innerHTML = ""; // Limpa a lista antes de renderizar novamente
  products.forEach((product) => {
    const productRow = document.createElement("tr");
    productRow.innerHTML = `
      <td>${product.name}</td>
      <td>${product.description}</td>
      <td>R$ ${product.price}</td>
      <td>${product.stock}</td>
      <td class="action-buttons">
        <button class="edit" onclick="editProduct('${product.id}')">Editar</button>
        <button class="delete" onclick="deleteProduct('${product.id}')">Excluir</button>
      </td>
    `;
    productList.appendChild(productRow);
  });
}

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const productId = document.getElementById("editProductId").value;

  // Se houver um ID de produto, vamos editar, senão, vamos criar
  if (productId) {
    updateProduct(productId, { name, description, price, stock });
  } else {
    createProduct({ name, description, price, stock });
  }
});

async function updateProduct(productId, updatedProduct) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedProduct),
      }
    );

    if (response.ok) {
      fetchProducts(); // Atualiza a lista de produtos
      resetForm(); // Limpa o formulário
    }
  } catch (error) {
    console.error("Erro ao editar produto:", error);
  }
}

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("editProductId").value = ""; // Limpa o ID do produto
}

function toggleAuth() {
  if (token) {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    window.location.href = "index.html";
  } else {
    window.location.href = "index.html";
  }
}

function updateNavbar() {
  if (token) {
    userEmailSpan.textContent = "Usuário: " + localStorage.getItem("email");
    document.getElementById("authButton").textContent = "Logout";
  } else {
    userEmailSpan.textContent = "";
    document.getElementById("authButton").textContent = "Login";
  }
}

updateNavbar();
fetchProducts();
