document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const userGreeting = document.getElementById('user-greeting');
  const saldoElement = document.getElementById('saldo');
  const anunciosList = document.getElementById('anuncios-list');
  const loginMessage = document.getElementById('login-message');

  let currentUser = null;

  // Função para verificar se o usuário está logado
  function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      showDashboard(currentUser);
    } else {
      showLogin();
    }
  }

  // Função para exibir o formulário de login
  function showLogin() {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
  }

  // Função para exibir o dashboard
  function showDashboard(user) {
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    userGreeting.textContent = user.username;
    saldoElement.textContent = user.saldo.toFixed(2);
    displayAnuncios();
  }

  // Função para criar um usuário (simulação de cadastro)
  function createUser(username, password) {
    const newUser = {
      username: username,
      password: password,
      saldo: 0.00
    };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  // Função para realizar o login
  function loginUser(username, password) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.username === username && user.password === password) {
        return user;
      }
    }
    return null;
  }

  // Mock de anúncios
  const anuncios = [
    { id: 1, titulo: 'Anúncio 1', recompensa: 0.05 },
    { id: 2, titulo: 'Anúncio 2', recompensa: 0.10 },
    { id: 3, titulo: 'Anúncio 3', recompensa: 0.07 }
  ];

  // Função para exibir os anúncios
  function displayAnuncios() {
    anunciosList.innerHTML = '';
    anuncios.forEach(anuncio => {
      const li = document.createElement('li');
      li.innerHTML = `${anuncio.titulo} - Recompensa: ${anuncio.recompensa.toFixed(2)} Kz
                       <button class="view-ad" data-id="${anuncio.id}">Visualizar</button>`;
      anunciosList.appendChild(li);
    });

    // Adicionar event listeners para os botões "Visualizar"
    const viewAdButtons = document.querySelectorAll('.view-ad');
    viewAdButtons.forEach(button => {
      button.addEventListener('click', function() {
        const anuncioId = parseInt(this.dataset.id);
        visualizarAnuncio(anuncioId);
      });
    });
  }

  // Função para simular a visualização de um anúncio
  function visualizarAnuncio(anuncioId) {
    const anuncio = anuncios.find(a => a.id === anuncioId);
    if (anuncio) {
      currentUser.saldo += anuncio.recompensa;
      saldoElement.textContent = currentUser.saldo.toFixed(2);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      alert(`Você visualizou "${anuncio.titulo}" e ganhou ${anuncio.recompensa.toFixed(2)} Kz!`);
    }
  }

  // Event listener para o formulário de login
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let user = loginUser(username, password);

    if (!user) {
        // Tenta criar um novo usuário se o login falhar (simulando cadastro)
        user = createUser(username, password);
        loginMessage.textContent = "Usuário criado com sucesso! Logado.";

    }
    if (user) {
      currentUser = user;
      showDashboard(currentUser);
    } else {
      loginMessage.textContent = "Usuário ou senha incorretos.";
    }
  });

  // Inicialização: Verificar o status de login ao carregar a página
  checkLoginStatus();
});