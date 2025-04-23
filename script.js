document.addEventListener("DOMContentLoaded", function () {
    console.log("JS carregado");

    // ========== ELEMENTOS ==========
    const closeModalBtn = document.getElementById("close-modal-btn");
    const closeModalBtn1 = document.getElementById("close-modal-btn1");
    const modalRegistrar = document.getElementById("modal-registrar");
    const modalLogin = document.getElementById("modal-login");
    const openRegisterModalButton = document.getElementById("openRegisterModal");
    const openLoginModalButton = document.getElementById("openLoginModal");
    const modalBtns = document.querySelectorAll(".modal-btn");

    const openBtn = document.getElementById("openMenu");
    const closeBtn = document.getElementById("closeMenu");
    const modal = document.getElementById("menuModal");

    // ========== MENU LATERAL ==========
    openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        setTimeout(() => modal.classList.add("opacity-100"), 10);
        modal.classList.add("translate-x-0");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("opacity-100");
        setTimeout(() => modal.classList.add("hidden"), 300);
        modal.classList.remove("translate-x-0");
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("opacity-100");
            setTimeout(() => modal.classList.add("hidden"), 300);
            modal.classList.remove("translate-x-0");
        }
    });

    // ========== ABRIR MODAIS (Login/Registro) ==========
    if (openRegisterModalButton) {
        openRegisterModalButton.addEventListener("click", () => {
            modalRegistrar.classList.remove("hidden", "opacity-0");
            modalRegistrar.classList.add("flex");
            setTimeout(() => modalRegistrar.classList.add("opacity-100"), 10);
        });
    }

    if (openLoginModalButton) {
        openLoginModalButton.addEventListener("click", () => {
            modalLogin.classList.remove("hidden", "opacity-0");
            modalLogin.classList.add("flex");
            setTimeout(() => modalLogin.classList.add("opacity-100"), 10);
        });
    }

    // ========== FECHAR MODAIS ==========
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            modalRegistrar.classList.remove("opacity-100");
            setTimeout(() => {
                modalRegistrar.classList.remove("flex");
                modalRegistrar.classList.add("hidden", "opacity-0");
            }, 300);
        });
    }

    if (closeModalBtn1) {
        closeModalBtn1.addEventListener("click", () => {
            modalLogin.classList.remove("opacity-100");
            setTimeout(() => {
                modalLogin.classList.remove("flex");
                modalLogin.classList.add("hidden", "opacity-0");
            }, 300);
        });
    }

    // ========== BOTÕES DE TEXTO (Login / Registrar dentro do modal de escolha) ==========
    modalBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const action = btn.textContent.trim().toLowerCase();

            if (action === "login") {
                modalLogin.classList.remove("hidden", "opacity-0");
                modalLogin.classList.add("flex");
                setTimeout(() => modalLogin.classList.add("opacity-100"), 10);
            } else if (action === "registrar") {
                modalRegistrar.classList.remove("hidden", "opacity-0");
                modalRegistrar.classList.add("flex");
                setTimeout(() => modalRegistrar.classList.add("opacity-100"), 10);
            }
        });
    });

    // ========== REDIRECIONAMENTO ==========
    const meuBotao = document.getElementById("meuBotao");
    if (meuBotao) {
        meuBotao.addEventListener("click", () => {
            window.location.href = "passagem.html";
        });
    }



    // ================== FORMULÁRIO DE CADASTRO ==================
    const cadastroForm = document.getElementById("cadastroForm");
    if (cadastroForm) {
        let ultimaTentativa = 0;

        cadastroForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nome = document.getElementById("nome");
            const email = document.getElementById("email");
            const senha = document.getElementById("senha");
            const confirmarSenha = document.getElementById("confirmar_senha");

            const erroNome = document.getElementById("erro-nome");
            const erroEmail = document.getElementById("erro-email");
            const erroSenha = document.getElementById("erro-senha");
            const erroConfirmarSenha = document.getElementById("erro-confirmar_senha");

            const limparErros = () => {
                [nome, email, senha, confirmarSenha].forEach(i => i.classList.remove("erro-input", "sucesso-input"));
                [erroNome, erroEmail, erroSenha, erroConfirmarSenha].forEach(e => e.textContent = "");
            };
            limparErros();

            let valido = true;
            const agora = Date.now();

            if (agora - ultimaTentativa < 5000) {
                erroNome.textContent = "Espere alguns segundos antes de tentar novamente.";
                return;
            }
            ultimaTentativa = agora;

            // Validação
            if (!nome.value.trim() || nome.value.length < 3 || !/^[A-Za-zÀ-ÿ\s]+$/.test(nome.value)) {
                erroNome.textContent = "O nome deve ter pelo menos 3 letras e não conter números ou símbolos!";
                nome.classList.add("erro-input");
                valido = false;
            } else nome.classList.add("sucesso-input");

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email.value.trim())) {
                erroEmail.textContent = "Digite um e-mail válido!";
                email.classList.add("erro-input");
                valido = false;
            } else email.classList.add("sucesso-input");

            if (
                senha.value.length < 8 ||
                !/[A-Z]/.test(senha.value) ||
                !/[0-9]/.test(senha.value) ||
                !/[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/.test(senha.value)
            ) {
                erroSenha.textContent = "A senha deve ter 8 caracteres, uma maiúscula, um número e um caractere especial!";
                senha.classList.add("erro-input");
                valido = false;
            } else senha.classList.add("sucesso-input");

            if (senha.value !== confirmarSenha.value) {
                erroConfirmarSenha.textContent = "As senhas não coincidem!";
                confirmarSenha.classList.add("erro-input");
                valido = false;
            } else confirmarSenha.classList.add("sucesso-input");

            if (!valido) return;

            // Envia para o servidor
            fetch('http://localhost:3000/api/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nome.value, email: email.value, senha: senha.value })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    erroNome.textContent = data.error;
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "Cadastro realizado!",
                        text: "Agora faça login para continuar.",
                        confirmButtonColor: "#10B981"
                    });
                    cadastroForm.reset();
                    limparErros();
                }
            })
            .catch(() => {
                erroNome.textContent = "Ocorreu um erro ao tentar cadastrar o usuário!";
            });
        });
    }

    // ================== FORMULÁRIO DE LOGIN ==================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const emailLogin = document.getElementById("emailc")?.value.trim();
            const senhaLogin = document.getElementById("senhac")?.value.trim();

            if (!emailLogin || !senhaLogin) {
                return Swal.fire({
                    icon: "error",
                    title: "Campos obrigatórios!",
                    text: "Por favor, preencha todos os campos."
                });
            }

            Swal.fire({
                title: "Verificando...",
                text: "Aguarde um momento.",
                icon: "info",
                allowOutsideClick: false,
                showConfirmButton: false
            });

            try {
                const response = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailc: emailLogin, senhac: senhaLogin })
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || "Erro desconhecido no servidor.");

                Swal.fire({
                    icon: "success",
                    title: "Login realizado com sucesso!",
                    text: "Redirecionando...",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });

                if (data.token) localStorage.setItem("token", data.token);

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Erro!",
                    text: error.message || "Erro ao tentar fazer login. Tente novamente."
                });
            }
        });
    }

    // ================== LOGIN GOOGLE ==================
    function handleCredentialResponse(response) {
        const data = jwt_decode(response.credential);
        console.log("Usuário logado:", data);

        fetch("http://localhost:3000/api/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: data.name,
                email: data.email,
                provider: "google",
                provider_id: data.sub
            })
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                window.location.href = "login.html";
            } else {
                alert("Erro ao autenticar com o Google!");
            }
        })
        .catch(err => {
            console.error("Erro:", err);
            alert("Erro de comunicação com o servidor!");
        });
    }

    window.onload = function () {
        google.accounts.id.initialize({
            client_id: "756712689720-kgtj8e48nh9o0gaccnfvop509103luvr.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        const googleOptions = {
            type: "icon",
            shape: "square",
            theme: "filled_black",
            text: "signin_with",
            size: "medium",
            locale: "pt-BR"
        };

        google.accounts.id.renderButton(document.getElementById("buttonDiv"), googleOptions);
        google.accounts.id.renderButton(document.getElementById("googleLoginButton"), googleOptions);

        renderGitHubLoginButton("githubLoginButton");
        renderGitHubLoginButton("githubRegisterButton");
    };

    // ================== LOGIN GITHUB ==================
    function renderGitHubLoginButton(containerID) {
        const container = document.getElementById(containerID);
        if (!container) return;

        const button = document.createElement("button");
        button.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="20">`;
        button.style.cssText = `
            background-color: #24292e;
            color: white;
            border: none;
            padding: 5px 5px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-weight: bold;
        `;

        button.onclick = () => {
            window.location.href = "http://127.0.0.1:3000/auth/github";
        };

        container.appendChild(button);
    }

    function extrairIATA(input, aeroportos) {
        const texto = input.trim().toLowerCase();
        console.log(`Extrair IATA: Input recebido: ${input}`);
    
        const aeroporto = aeroportos.find(a => {
            return a.iata.toLowerCase() === texto ||
                   a.cidade.toLowerCase() === texto ||
                   a.nome.toLowerCase().includes(texto) ||
                   input.includes(a.iata); // Se veio do datalist completo
        });
    
        if (aeroporto) {
            console.log(`Aeroporto encontrado: ${aeroporto.iata}`);
        } else {
            console.log("Aeroporto não encontrado, usando o valor original.");
        }
    
        return aeroporto ? aeroporto.iata : input.toUpperCase(); // fallback para evitar erro
    }
    
    // Inicializando o Litepicker para seleção de datas
    const picker = new Litepicker({
        element: document.getElementById('dateRange'),
        singleMode: false,
        format: 'DD/MM/YYYY',
        lang: 'pt-BR',
        onSelect: function (startDate, endDate) {
          console.log("Data de início:", startDate);
          console.log("Data de término:", endDate);
        }
      });
    
    let aeroportos = [];
    
    // Carregando os dados dos aeroportos a partir de um arquivo JSON
    fetch('/data/aeroportos.json') 
        .then(res => res.json())
        .then(data => {
            aeroportos = data;
            console.log("Aeroportos carregados:", aeroportos);
            preencherDatalist("lista-origem");
            preencherDatalist("lista-destino");
        })
        .catch(err => {
            console.error("Erro ao carregar aeroportos:", err);
        });
    
    // Função para preencher o datalist com as opções de aeroportos
    function preencherDatalist(idDatalist) {
        const datalist = document.getElementById(idDatalist);
        datalist.innerHTML = '';
    
        // Verificando se há aeroportos para adicionar
        if (aeroportos.length === 0) {
            console.error("Nenhum aeroporto encontrado para preencher o datalist.");
            return;
        }
    
        aeroportos.forEach(aero => {
            const option = document.createElement('option');
            option.value = `${aero.cidade} – ${aero.iata} (${aero.pais})`;
            datalist.appendChild(option);
        });
    }
    
    // Adicionando evento de clique no botão de busca de voos
    document.getElementById("btn-buscar-voos").addEventListener("click", buscarVoos);
    
    async function buscarVoos() {
        const origemInput = document.getElementById("origin").value.trim().toUpperCase();
        const destinoInput = document.getElementById("destination").value.trim().toUpperCase();
        const adultos = document.getElementById("passengers").value;
    
        const startDate = picker.getStartDate();
        const endDate = picker.getEndDate();
    
        if (!startDate || !endDate) {
            alert("Por favor, selecione as datas de ida e volta.");
            return;
        }
    
        // Formatando as datas de ida e volta no formato esperado pela API
        const departureDate = formatarDataParaAPI(startDate.format('DD/MM/YYYY'));
        const returnDate = formatarDataParaAPI(endDate.format('DD/MM/YYYY'));
        
        console.log("startDate:", startDate);
        console.log("endDate:", endDate);

    
        console.log("Data de Ida:", departureDate);
        console.log("Data de Volta:", returnDate);
    
        // Buscando os códigos IATA de origem e destino
        const origem = extrairIATA(origemInput, aeroportos);
        const destino = extrairIATA(destinoInput, aeroportos);
    
        console.log("Origem IATA:", origem);
        console.log("Destino IATA:", destino);
    
        try {
            // Enviando a requisição para a API com os parâmetros corretos
            console.log("Enviando requisição para a API...");
            const resposta = await fetch(`http://localhost:3000/api/voos?origem=${origem}&destino=${destino}&departureDate=${departureDate}&returnDate=${returnDate}&adultos=${adultos}`);
            
            console.log("Resposta recebida da API");
            const dados = await resposta.json();
    
            console.log("Dados recebidos:", dados);
    
            // Salva os resultados no localStorage
            localStorage.setItem("resultadosVoos", JSON.stringify(dados));
    
            // Redireciona para a página de resultados
            window.location.href = "passagens.html";
    
            // Renderiza os resultados na página
            renderizarResultados(dados);
        } catch (erro) {
            console.error("Erro ao buscar voos:", erro);
            document.getElementById("resultado").innerHTML = `<p class="text-red-500 font-bold">Erro ao buscar voos.</p>`;
        }
    }
    
    // Função de renderização de resultados
    function renderizarResultados(dados) {
        const resultadosDiv = document.getElementById("resultado");
        resultadosDiv.innerHTML = ""; // Limpar resultados anteriores
    
        console.log("Renderizando resultados...");
    
        dados.forEach(voo => {
            const vooElement = document.createElement("div");
            vooElement.classList.add("voo-item");
            vooElement.innerHTML = `
                <p><strong>Origem:</strong> ${voo.origem} | <strong>Destino:</strong> ${voo.destino}</p>
                <p><strong>Data de Ida:</strong> ${voo.dataIda} | <strong>Data de Volta:</strong> ${voo.dataVolta}</p>
                <p><strong>Preço:</strong> R$ ${voo.preco}</p>
            `;
            resultadosDiv.appendChild(vooElement);
        });
    }
    
    // Função para formatar as datas no formato YYYY-MM-DD
    function formatarDataParaAPI(data) {
        console.log("Data recebida para formatação:", data);
        
        const partes = data.split("/"); 
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const ano = partes[2];

        return `${ano}-${mes}-${dia}`;
    }
    

});
