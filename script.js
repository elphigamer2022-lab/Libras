document.addEventListener('DOMContentLoaded', () => {
    // === Lógica para a animação das seções. NÃO ALTERAR. ===
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // === Lógica para o FAQ interativo (acordeão). NÃO ALTERAR. ===
    const faqs = document.querySelectorAll('.faq-toggle');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const resposta = faq.nextElementSibling;
            faq.classList.toggle('active');
            resposta.classList.toggle('open');
        });
    });

    // === INÍCIO: Lógica para a troca de mensagens com fade. NÃO ALTERAR mais nada após o final desta seção. ===
    const titleElement = document.querySelector('#hero h1');
    const propagandaElement = document.querySelector('#hero p');

    if (titleElement && propagandaElement) {
        const titles = [
            'Aulas de Libras: Conecte-se com o Mundo Através de um Gesto.',
            'Comunique-se sem Barreiras: Domine a Língua Brasileira de Sinais.',
            'Libras na Prática: Aulas com a Professora [Nome da sua esposa]!',
            'Seu Caminho para a Inclusão Começa Aqui.'
        ];
        
        // As 4 mensagens diferentes para a propaganda
        const messages = [
            'Seja bem-vindo(a) ao seu primeiro passo em direção a um universo de expressão e inclusão.',
            'Aprenda Libras e abra as portas para a comunicação e a cultura surda.',
            'Aulas dinâmicas e focadas na prática para você sair sinalizando com confiança.',
            'Seu futuro começa aqui: Conecte-se com o mundo através de um gesto.'
        ];
        
        let messageIndex = 0;

        function changePropagandaMessage() {
            // Passo 1: Adiciona a classe 'fade-out' para os textos desaparecerem
            titleElement.classList.add('fade-out');
            propagandaElement.classList.add('fade-out');

            // Timeout para dar tempo do fade-out ocorrer (1.5s - definido no CSS)
            setTimeout(() => {
                // Passo 2: Atualiza os textos para a próxima mensagem
                messageIndex = (messageIndex + 1) % messages.length;
                titleElement.textContent = titles[messageIndex];
                propagandaElement.textContent = messages[messageIndex];
                
                // Passo 3: Remove a classe 'fade-out' para os novos textos aparecerem (fade-in)
                titleElement.classList.remove('fade-out');
                propagandaElement.classList.remove('fade-out');
            }, 1500); // 1500ms (1.5s) corresponde à duração da transição no CSS
        }
        
        // Inicia a função e a repete a cada 6.5 segundos (5s de exibição + 1.5s de transição)
        setInterval(changePropagandaMessage, 6500);
    }
    // === FIM: Lógica para a troca de mensagens com fade. ===

    // =================================================================
    // FUNÇÃO PARA ENVIAR DADOS AO BANCO DE DADOS (CONFIGURAÇÃO)
    // =================================================================
    async function enviarDadosAoBanco(dados) {
        /* AJUSTE AQUI: Substitua 'SUA_URL_AQUI' pela URL do seu servidor/banco de dados. */
        const URL_BANCO = 'SUA_URL_AQUI'; 
        console.log("Integrando dados ao sistema:", dados);

        try {
            const response = await fetch(URL_BANCO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            return response.ok;
        } catch (error) {
            console.error("Erro na conexão com o banco de dados:", error);
            return false;
        }
    }

    // === Lógica do Chatbot de Fluxo (AJUSTADA COM VALIDAÇÕES E BOTOES) ===
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotBtn = document.getElementById('close-chatbot-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatbotBody = document.getElementById('chatbot-body');

    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.classList.add('bot-message');
    typingIndicator.innerHTML = `<span></span><span></span><span></span>`;

    let currentState = 'greeting';
    const userData = {};

    const dialogFlow = {
        'greeting': {
    message: 'Olá! Bem-vindo(a) à nossa plataforma de aulas de Libras! Como posso ajudar?',
    options: ['Sim, quero me inscrever.', 'Realizei o pagamento'],
    transition: (input) => {
        if (input.toLowerCase().includes('sim')) return 'startRegistration';
        // MUDANÇA AQUI: Agora ele vai para a verificação em vez de resetar
        if (input.toLowerCase().includes('pagamento')) return 'askNameVerification';
        return 'fallback';
    }
},
'askNameVerification': {
    message: 'Para verificarmos seu pagamento, por favor, informe seu Nome Completo (o mesmo usado na compra):',
    transition: (input) => {
        if (input.trim().split(' ').length < 2) return 'invalidNameVerification';
        userData.nome = input;
        userData.status_verificacao = 'aguardando_confirmacao'; // Identificador para o seu banco
        return 'askCourseVerification';
    }
},
'invalidNameVerification': {
    message: 'Por favor, digite seu nome e sobrenome para localizarmos a transação.',
    transition: (input) => {
        if (input.trim().split(' ').length < 2) return 'invalidNameVerification';
        userData.nome = input;
        return 'askCourseVerification';
    }
},
'askCourseVerification': {
    message: 'Qual curso você adquiriu?',
    options: ['Libras para Iniciantes', 'Libras Intermediário'],
    transition: (input) => {
        userData.curso = input;
        
        // Envia ao banco para o seu sistema cruzar os dados (Nome + Curso + Valor esperado)
        enviarDadosAoBanco(userData); 
        
        return 'paymentProcessing';
    }
},
'paymentProcessing': {
    message: 'Obrigado! Estamos processando a sua verificação no sistema. Em breve você receberá um e-mail com as instruções de acesso ao curso.',
    final: true
},

        'startRegistration': {
            message: 'Perfeito! A inscrição é super simples e rápida. Primeiro, para que eu possa te ajudar melhor, qual é o seu nome completo?',
            transition: (input) => {
                if (input.trim().split(' ').length < 2) return 'invalidName';
                userData.nome = input;
                return 'askEmail';
            }
        },
        'invalidName': {
            message: 'Por favor, digite seu nome completo (Nome e Sobrenome).',
            transition: (input) => {
                if (input.trim().split(' ').length < 2) return 'invalidName';
                userData.nome = input;
                return 'askEmail';
            }
        },
        'askEmail': {
            getMessage: () => `Ótimo, ${userData.nome}! Agora, por favor, informe seu e-mail (deve ser @gmail.com).`,
            transition: (input) => {
                if (!input.toLowerCase().endsWith('@gmail.com')) return 'invalidEmail';
                userData.email = input;
                return 'askPhone';
            }
        },
        'invalidEmail': {
            message: 'Ops! O e-mail informado é inválido. Por favor, use uma conta @gmail.com para continuar.',
            transition: (input) => {
                if (!input.toLowerCase().endsWith('@gmail.com')) return 'invalidEmail';
                userData.email = input;
                return 'askPhone';
            }
        },
        'askPhone': {
            message: 'Qual é o seu telefone com DDD? Exemplo: 49 98359494',
            transition: (input) => {
                const phoneRegex = /^\d{2}\s\d{8,9}$/;
                if (!phoneRegex.test(input)) return 'invalidPhone';
                userData.telefone = input;
                return 'confirmData';
            }
        },
        'invalidPhone': {
            message: 'Formato inválido. Digite apenas o DDD, espaço e o número. Ex: 49 98359494',
            transition: (input) => {
                const phoneRegex = /^\d{2}\s\d{8,9}$/;
                if (!phoneRegex.test(input)) return 'invalidPhone';
                userData.telefone = input;
                return 'confirmData';
            }
        },
        'confirmData': {
            getMessage: () => `Certo, ${userData.nome}. Por favor, confirme se os dados estão corretos:\n\nNome: ${userData.nome}\nE-mail: ${userData.email}\nTelefone: ${userData.telefone}\n\nOs dados estão corretos?`,
            options: ['Sim, estão corretos.', 'Não, preciso corrigir.'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'selectCourse';
                if (input.toLowerCase().includes('corrigir')) return 'correctData';
                return 'fallback';
            }
        },
        'correctData': {
            message: 'Sem problemas! Qual dado você gostaria de corrigir?',
            options: ['Nome', 'E-mail', 'Telefone'],
            transition: (input) => {
                if (input.toLowerCase().includes('nome')) return 'startRegistration';
                if (input.toLowerCase().includes('e-mail')) return 'askEmail';
                if (input.toLowerCase().includes('telefone')) return 'askPhone';
                return 'fallback';
            }
        },
        'selectCourse': {
            message: 'Agora que seus dados estão confirmados, vamos escolher o curso. Qual você gostaria de fazer?',
            options: ['Libras para Iniciantes', 'Libras Intermediário'],
            transition: (input) => {
                userData.curso = input.toLowerCase().includes('iniciantes') ? 'Libras para Iniciantes' : 'Libras Intermediário';
                return 'confirmCourse';
            }
        },
        'confirmCourse': {
            getMessage: () => `Excelente escolha! Sua inscrição para ${userData.curso} está quase completa. Como prefere pagar?`,
            options: ['Pix', 'Cartão de crédito'],
            transition: (input) => {
                userData.metodo_pagamento = input;
                enviarDadosAoBanco(userData); // Envia os dados coletados ao seu banco
                return input.toLowerCase().includes('pix') ? 'paymentPix' : 'paymentCreditCard';
            }
        },
        'paymentPix': {
            message: 'Chave Pix: [Sua Chave Aqui].\n\nPor favor, realize o pagamento. Quando concluir, inicie a conversa novamente apertando na opção "Realizei o pagamento".',
            final: true
        },
        'paymentCreditCard': {
            message: 'Link para cartão: [Seu Link Aqui].\n\nPor favor, realize o pagamento. Quando concluir, inicie a conversa novamente apertando na opção "Realizei o pagamento".',
            final: true
        },
        'fallback': {
            message: 'Desculpe, não entendi. Por favor, use as opções para que eu possa te ajudar melhor.',
            transition: () => 'greeting'
        }
        
    };

    function addMessageToChat(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${type}-message`);
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
        chatbotBody.appendChild(messageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function addBotResponseWithFlow(message, options) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
        chatbotBody.appendChild(messageDiv);

        if (options && options.length > 0) {
            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('message-options');
            options.forEach(optionText => {
                const optionButton = document.createElement('button');
                optionButton.classList.add('option-button');
                optionButton.textContent = optionText;
                optionButton.addEventListener('click', () => {
                    handleUserOption(optionText);
                });
                optionsDiv.appendChild(optionButton);
            });
            chatbotBody.appendChild(optionsDiv);
        }
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function handleBotResponse(input) {
        let response = dialogFlow[currentState];
        const nextState = response.transition ? response.transition(input) : null;
        
        if (nextState) {
            currentState = nextState;
            response = dialogFlow[currentState];
        }

        const messageText = typeof response.getMessage === 'function' ? response.getMessage() : response.message;
        addBotResponseWithFlow(messageText, response.options);
    }

    function handleUserOption(optionText) {
        addMessageToChat(optionText, 'user');
        handleBotResponse(optionText);
    }

    function handleUserInput() {
        const userMessage = userInput.value;
        if (userMessage.trim() === '') return;

        addMessageToChat(userMessage, 'user');
        userInput.value = '';
        handleBotResponse(userMessage);
    }

    chatbotToggleBtn.addEventListener('click', () => {
        chatbotContainer.classList.toggle('hidden');
        if (!chatbotContainer.classList.contains('hidden')) {
            if (chatbotBody.children.length === 0) {
                addBotResponseWithFlow(dialogFlow.greeting.message, dialogFlow.greeting.options);
            }
        }
    });

    closeChatbotBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('hidden');
    });

    sendBtn.addEventListener('click', handleUserInput);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleUserInput();
        }
    });

    // === CÓDIGO PARA ROLAGEM HORIZONTAL COM MOUSE ===
    const scrollContainers = document.querySelectorAll('.scroll-container');

    scrollContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY * 1.5; 
            }
        });

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    }); // Fecha o scrollContainers.forEach
}); // Fecha o document.addEventListener('DOMContentLoaded', ...)


