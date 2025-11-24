document.addEventListener('DOMContentLoaded', () => {
    // === Lógica para a animação das seções. NÃO ALTERAR. ===
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        }
        );
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

    // === Lógica do Chatbot de Fluxo. NÃO ALTERAR. ===
    // ELEMENTOS DO CHATBOT. NÃO ALTERAR.
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

    // === FLUXO DE CONVERSA DO CHATBOT. ALTERE OS TEXTOS E LINKS AQUI. ===
    const dialogFlow = {
        'greeting': {
            // Mensagem inicial do chatbot. Exemplo: "Olá! Bem-vindo(a) à nossa plataforma de aulas de Libras com a Professora Maria!"
            message: 'Olá! Bem-vindo(a) à nossa plataforma de aulas de Libras com a Professora [Nome da sua esposa]! Estou aqui para te ajudar com a sua inscrição. Vamos lá?',
            // Opções de resposta para o usuário. NÃO ALTERAR.
            options: ['Sim, quero me inscrever.', 'Não, obrigado(a). Quero só tirar uma dúvida.', 'Já sou aluno(a).'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'startRegistration';
                if (input.toLowerCase().includes('dúvida')) return 'askDoubtOptions';
                if (input.toLowerCase().includes('aluno')) return 'existingStudent';
                return 'fallback';
            }
        },
        'startRegistration': {
            message: 'Perfeito! A inscrição é super simples e rápida. Primeiro, para que eu possa te ajudar melhor, qual é o seu nome completo?',
            transition: (input) => {
                userData.name = input;
                return 'askEmail';
            }
        },
        'askEmail': {
            // Mensagem que usa o nome do usuário.
            getMessage: () => `Ótimo, ${userData.name}! Agora, por favor, me informe o seu e-mail. Usaremos ele para enviar a confirmação da sua inscrição e todos os detalhes do curso.`,
            transition: (input) => {
                userData.email = input;
                return 'askPhone';
            }
        },
        'askPhone': {
            message: 'E para finalizar, qual é o seu número de telefone com DDD, por favor? Assim, podemos entrar em contato com você se for necessário.',
            transition: (input) => {
                userData.phone = input;
                return 'confirmData';
            }
        },
        'confirmData': {
            getMessage: () => `Certo, ${userData.name}. Por favor, confirme se os dados estão corretos:\n\nNome: ${userData.name}\nE-mail: ${userData.email}\nTelefone: ${userData.phone}\n\nOs dados estão corretos?`,
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
                if (input.toLowerCase().includes('nome')) return 'correctName';
                if (input.toLowerCase().includes('e-mail')) return 'correctEmail';
                if (input.toLowerCase().includes('telefone')) return 'correctPhone';
                return 'fallback';
            }
        },
        'correctName': {
            message: 'Ok, qual é o seu nome completo?',
            transition: (input) => {
                userData.name = input;
                return 'confirmData';
            }
        },
        'correctEmail': {
            message: 'Por favor, digite seu e-mail novamente.',
            transition: (input) => {
                userData.email = input;
                return 'confirmData';
            }
        },
        'correctPhone': {
            message: 'Por favor, digite seu telefone com DDD novamente.',
            transition: (input) => {
                userData.phone = input;
                return 'confirmData';
            }
        },
        'selectCourse': {
            // Mensagem sobre os cursos. Edite os nomes dos cursos se necessário.
            message: 'Agora que seus dados estão confirmados, vamos escolher o curso. A Professora [Nome da sua esposa] oferece dois cursos incríveis:\n\nCurso 1: Libras para Iniciantes (módulo I)\nCurso 2: Libras Intermediário (módulo II)\n\nQual curso você gostaria de fazer?',
            options: ['Libras para Iniciantes', 'Libras Intermediário'],
            transition: (input) => {
                if (input.toLowerCase().includes('iniciantes')) {
                    userData.course = 'Libras para Iniciantes (módulo I)';
                } else {
                    userData.course = 'Libras Intermediário (módulo II)';
                }
                return 'confirmCourse';
            }
        },
        'confirmCourse': {
            // Mensagem de confirmação. Edite o valor do curso e o link de pagamento. Exemplo: "O valor do curso é R$ 150,00."
            getMessage: () => `Excelente escolha! A sua inscrição para o curso de ${userData.course} está quase completa.\n\nAgora, para finalizar, você precisa realizar o pagamento. O valor do curso é [Valor do Curso]. Você pode pagar por Pix ou cartão de crédito.\n\nQual método de pagamento você prefere?`,
            options: ['Pix', 'Cartão de crédito'],
            transition: (input) => {
                if (input.toLowerCase().includes('pix')) return 'paymentPix';
                if (input.toLowerCase().includes('cartão')) return 'paymentCreditCard';
                return 'fallback';
            }
        },
        'paymentPix': {
            // Mensagem com a chave Pix. Edite a chave. Exemplo: "Você pode usar a chave a seguir: 123.456.789-00"
            message: 'Ótima escolha! Para o pagamento via Pix, você pode usar a chave a seguir: [Chave Pix].\n\nAssim que o pagamento for confirmado, você receberá um e-mail com todas as instruções para acessar a plataforma e começar suas aulas.',
            final: true
        },
        'paymentCreditCard': {
            // Mensagem com o link de pagamento do cartão. Edite o link. Exemplo: "...direcionado(a) à nossa página de pagamento seguro: https://pagseguro.com.br/pagamento"
            message: 'Sem problemas! Para pagar com cartão de crédito, por favor, clique no link a seguir para ser direcionado(a) à nossa página de pagamento seguro: [Link para a página de pagamento].\n\nAssim que o pagamento for confirmado, você receberá um e-mail com todas as instruções para acessar a plataforma e começar suas aulas.',
            final: true
        },
        'existingStudent': {
            // Mensagem para alunos existentes. Edite o link de login. Exemplo: "...diretamente por este link: https://plataforma.seusite.com.br/login"
            message: 'Ah, que bom ter você de volta! Se você já é aluno(a), pode fazer login na nossa plataforma diretamente por este link: [Link de Login].\n\nPrecisa de alguma outra ajuda?',
            final: true
        },
        // --- NOVO FLUXO PARA DÚVIDAS. NÃO ALTERAR os nomes dos estados, apenas o conteúdo. ---
        'askDoubtOptions': {
            message: 'Claro! Fico feliz em te ajudar. Para facilitar, selecione um dos tópicos abaixo ou digite sua pergunta:',
            options: ['Conteúdo do Curso', 'Preço e Pagamento', 'Horários e Acesso', 'Certificado'],
            transition: (input) => {
                const lowerInput = input.toLowerCase();
                if (lowerInput.includes('conteúdo') || lowerInput.includes('o que vou aprender')) return 'doubtContent';
                if (lowerInput.includes('preço') || lowerInput.includes('pagamento') || lowerInput.includes('quanto custa')) return 'doubtPrice';
                if (lowerInput.includes('horários') || lowerInput.includes('acesso') || lowerInput.includes('ao vivo') || lowerInput.includes('gravadas')) return 'doubtSchedule';
                if (lowerInput.includes('certificado')) return 'doubtCertificate';
                return 'fallbackDoubt';
            }
        },
        'doubtContent': {
            // Detalhes sobre o conteúdo do curso. Edite conforme a grade de aulas.
            getMessage: () => `Nossos cursos são desenhados para que você aprenda Libras de forma prática e eficaz.\n\nO **Curso de Libras para Iniciantes (módulo I)** ensina o alfabeto manual, saudações, pronomes, verbos básicos e o vocabulário do dia a dia para que você se comunique com confiança.\n\nJá o **Curso de Libras Intermediário (módulo II)** aprofunda o vocabulário e a gramática, permitindo que você construa frases mais complexas e se comunique com mais fluidez.\n\nA sua dúvida foi respondida?`,
            options: ['Sim, obrigado(a)!', 'Tenho outra dúvida.'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'endDoubt';
                if (input.toLowerCase().includes('outra dúvida')) return 'askAnotherDoubt';
                return 'fallbackDoubt';
            }
        },
        'doubtPrice': {
            // Detalhes sobre o preço. Edite o valor.
            getMessage: () => `O valor de cada curso é R$ [Valor do Curso], com pagamento único. Você pode pagar de forma 100% segura por Pix ou cartão de crédito. O acesso à plataforma é liberado imediatamente após a confirmação do pagamento.\n\nA sua dúvida foi respondida?`,
            options: ['Sim, obrigado(a)!', 'Tenho outra dúvida.'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'endDoubt';
                if (input.toLowerCase().includes('outra dúvida')) return 'askAnotherDoubt';
                return 'fallbackDoubt';
            }
        },
        'doubtSchedule': {
            // Detalhes sobre horários. Edite se as aulas são gravadas/ao vivo e a duração do acesso.
            getMessage: () => `Nossas aulas são 100% online e gravadas! Você pode assistir no seu tempo, de onde estiver e quantas vezes quiser. O acesso é liberado pelo tempo que o aluno escolher, permitindo que você revise o conteúdo sempre que precisar.\n\nA sua dúvida foi respondida?`,
            options: ['Sim, obrigado(a)!', 'Tenho outra dúvida.'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'endDoubt';
                if (input.toLowerCase().includes('outra dúvida')) return 'askAnotherDoubt';
                return 'fallbackDoubt';
            }
        },
        'doubtCertificate': {
            // Detalhes sobre o certificado. Edite as informações.
            getMessage: () => `Sim! Ao concluir o curso, você recebe um certificado digital de conclusão, que tem validade em todo o Brasil. Ele comprova as suas horas de estudo e a sua dedicação ao aprendizado de Libras.\n\nA sua dúvida foi respondida?`,
            options: ['Sim, obrigado(a)!', 'Tenho outra dúvida.'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'endDoubt';
                if (input.toLowerCase().includes('outra dúvida')) return 'askAnotherDoubt';
                return 'fallbackDoubt';
            }
        },
        'endDoubt': {
            message: 'Fico feliz em ter ajudado! Se mudar de ideia, é só me chamar. Precisa de mais alguma coisa?',
            options: ['Sim, preciso.', 'Não, obrigado(a).'],
            transition: (input) => {
                if (input.toLowerCase().includes('sim')) return 'greeting';
                return 'finalMessage';
            }
        },
        'askAnotherDoubt': {
            message: 'Sem problemas! Pode perguntar, estou aqui para te ajudar. Se a sua dúvida for mais específica, posso te direcionar para um de nossos especialistas.',
            transition: (input) => {
                if (input.length > 20) {
                    return 'specialist';
                }
                if (input.toLowerCase().includes('preço')) return 'doubtPrice';
                if (input.toLowerCase().includes('duração')) return 'doubtDuration';
                if (input.toLowerCase().includes('metodologia')) return 'doubtMethodology';
                if (input.toLowerCase().includes('conteúdo')) return 'doubtContent';
                return 'fallbackDoubt';
            }
        },
        'specialist': {
            message: 'Entendido. A sua dúvida é muito específica. Por favor, deixe-nos seu e-mail ou telefone para que um de nossos especialistas possa entrar em contato diretamente com você.',
            final: true
        },
        'finalMessage': {
            message: 'Ótimo! Sua solicitação foi enviada. Boas aulas! 😊',
            final: true
        },
        'fallback': {
            message: 'Desculpe, não entendi. Por favor, use as opções para que eu possa te ajudar melhor.',
            transition: () => 'askDoubtOptions'
        },
        'fallbackDoubt': {
            message: 'Não consegui entender sua dúvida. Por favor, tente perguntar novamente ou clique nas opções abaixo.',
            options: ['Conteúdo do Curso', 'Preço e Pagamento', 'Horários e Acesso', 'Certificado'],
            transition: () => 'askDoubtOptions'
        }
    };
    
    // FUNÇÕES DE EXIBIÇÃO DE MENSAGENS E OPÇÕES. NÃO ALTERAR.
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

    function showTypingIndicator() {
        chatbotBody.appendChild(typingIndicator);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
        typingIndicator.style.display = 'flex';
    }

    function hideTypingIndicator() {
        if (chatbotBody.contains(typingIndicator)) {
            chatbotBody.removeChild(typingIndicator);
        }
        typingIndicator.style.display = 'none';
    }

    function handleBotResponse(input) {
        let response = dialogFlow[currentState];
        
        if (response.action) {
            response.action(input);
        }

        if (response.transition) {
            const nextState = response.transition(input);
            if (nextState) {
                currentState = nextState;
                response = dialogFlow[currentState];
            } else {
                response = dialogFlow['fallback'];
                currentState = response.transition();
            }
        }
        
        const messageText = typeof response.getMessage === 'function' ? response.getMessage() : response.message;
        const messageOptions = response.options;

        addBotResponseWithFlow(messageText, messageOptions);
    }
    
    function handleUserOption(optionText) {
        addMessageToChat(optionText, 'user');
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            handleBotResponse(optionText);
            if (dialogFlow[currentState].final) {
                setTimeout(() => {
                    currentState = 'greeting';
                    addBotResponseWithFlow(dialogFlow.greeting.message, dialogFlow.greeting.options);
                }, 5000);
            }
        }, 800);
    }

    function handleUserInput() {
        const userMessage = userInput.value;
        if (userMessage.trim() === '') return;

        addMessageToChat(userMessage, 'user');
        userInput.value = '';
        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();
            handleBotResponse(userMessage);
            if (dialogFlow[currentState].final) {
                setTimeout(() => {
                    currentState = 'greeting';
                    addBotResponseWithFlow(dialogFlow.greeting.message, dialogFlow.greeting.options);
                }, 5000);
            }
        }, 800);
    }

    // EVENTOS DE CLIQUE. NÃO ALTERAR.
    chatbotToggleBtn.addEventListener('click', () => {
        chatbotContainer.classList.toggle('hidden');
        if (!chatbotContainer.classList.contains('hidden')) {
            if (chatbotBody.children.length === 0) {
                addBotResponseWithFlow(dialogFlow.greeting.message, dialogFlow.greeting.options);
            }
            userInput.focus();
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

        // AJUSTE: Mapeia o scroll vertical para horizontal com maior sensibilidade (Fator 1.5)
        container.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) { // Verifica se houve rolagem vertical
                e.preventDefault(); // Impede a rolagem vertical padrão
                // Ajusta a sensibilidade para fazer o scroll horizontal
                container.scrollLeft += e.deltaY * 1.5; 
            }
        });

        // Lógica de arrastar (mousedown/mousemove) mantida:
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
    });

// =================================================================
// FUNÇÕES DE CRONÔMETRO REUTILIZÁVEIS PARA AULAS (AO VIVO E GRUPO)
// =================================================================

// Função para verificar se a data é Sábado (6) ou Domingo (0)
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

// Função de utilidade: Calcula o próximo horário de aula (USADA APENAS PELA AULA PARTICULAR)
function getNextClassTime(schedules, classDurationMs, closeToleranceAfterEndMs) {
    let now = new Date();
    
    // Pular Sábado e Domingo.
    while (isWeekend(now)) {
        now.setDate(now.getDate() + 1); // Avança um dia
        now.setHours(0, 0, 0, 0);       // Zera o horário para buscar o primeiro slot do dia
    }
    
    const today = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    let nextClassTime = null;

    // 1. Verificar horários de hoje (que agora é garantidamente um dia útil)
    for (const time of schedules) {
        // time[0] = hora, time[1] = minuto
        const classDate = new Date(year, month, today, time[0], time[1]);
        const closeTimeWithTolerance = classDate.getTime() + classDurationMs + closeToleranceAfterEndMs;
        
        // Se a aula ainda não terminou ou está dentro da tolerância de fechamento
        if (closeTimeWithTolerance > new Date().getTime()) { // Usa new Date() para a comparação "ao vivo"
            nextClassTime = classDate.getTime();
            break;
        }
    }
    
    // 2. Se não houver mais aulas hoje, buscar o primeiro horário de amanhã (ou próximo dia útil)
    if (!nextClassTime) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Pular fins de semana ao buscar o próximo dia
        while (isWeekend(tomorrow)) {
            tomorrow.setDate(tomorrow.getDate() + 1);
        }
        
        const tomorrowDate = tomorrow.getDate();
        const tomorrowMonth = tomorrow.getMonth();
        const tomorrowYear = tomorrow.getFullYear();
        
        // Pega o primeiro horário agendado
        const firstTimeTomorrow = schedules[0];
        nextClassTime = new Date(tomorrowYear, tomorrowMonth, tomorrowDate, firstTimeTomorrow[0], firstTimeTomorrow[1]).getTime();
    }
    
    return nextClassTime;
}

// =================================================================
// INÍCIO: AULAS PARTICULARES (Usa cronograma diário e getNextClassTime)
// =================================================================

// 1. MAPEAMENTO DE ALUNOS FIXO
// CHAVE: Horário da aula em formato "HH:MM" (string)
// VALOR: Nome do aluno
const studentSchedules = {
    "08:00": "João da Silva",
    "09:30": "Maria de Souza",
    "11:00": "Pedro Almeida",
    "13:00": "Ana Pereira",
    "14:30": "Carlos Mendes",
    "16:00": "Luisa Santos",
    "17:30": "Rafael Costa",
    "19:00": "Sofia Lima",
    "20:30": "Gustavo Ferreira"
    // Adicione mais agendamentos aqui se necessário
};

// Função principal de inicialização para as AULAS AO VIVO (Particulares)
function initializeAulaFeature() {
    // Elementos DOM para atualização
    const aulaStatusDiv = document.getElementById('aula-status');
    const iniciarAulaBtn = document.getElementById('iniciar-aula-btn');
    const alunoSaudacao = document.querySelector('.aula-card .aluno-saudacao'); // SELECIONA O ELEMENTO DE SAUDAÇÃO

    // Link do Zoom (Ajuste conforme necessário)
    const zoomLink = "https://zoom.us/j/seu_id_de_reuniao_aqui_particular";
    iniciarAulaBtn.setAttribute('data-zoom-link', zoomLink);
    iniciarAulaBtn.href = zoomLink;

    // HORÁRIOS PARA AULAS AO VIVO (PARTICULARES) - FORMATO [HORA, MINUTO]
    // Esta lista DEVE CORRESPONDER às chaves do studentSchedules acima.
    const classSchedules = [
        [8, 0], [9, 30], [11, 0], [13, 0], [14, 30], [16, 0], [17, 30], [19, 0], [20, 30] 
    ];

    // Duração e Tolerâncias
    const classDurationMs = 60 * 60 * 1000;         // 1 hora
    const openToleranceBeforeMs = 10 * 60 * 1000;   // Sala abre 10 minutos antes
    
    // Tolerância de entrada de 10 minutos. A sala fecha 10 minutos após o início.
    const entryToleranceAfterStartMs = 10 * 60 * 1000; 
    
    // O tempo limite total da aula para a contagem do fim do dia
    const closeToleranceAfterEndMs = 30 * 60 * 1000; 

    let countdownInterval;

    function updateAulaStatus() {
        const now = new Date().getTime();
        
        // Encontra o próximo horário disponível (hoje ou amanhã, excluindo fins de semana)
        const nextClassTime = getNextClassTime(classSchedules, classDurationMs, closeToleranceAfterEndMs);

        if (!nextClassTime) {
            if (countdownInterval) clearInterval(countdownInterval);
            // ATUALIZA A SAUDAÇÃO PARA GENÉRICO SE NÃO HOUVER MAIS AULAS
            alunoSaudacao.innerHTML = `Olá, **Aluno(a)**!`; 
            aulaStatusDiv.innerHTML = `<p class="status-fechado"><i class="fas fa-times-circle"></i> O calendário de aulas particulares de hoje foi encerrado.</p>`;
            iniciarAulaBtn.style.display = 'none';
            return;
        }

        const startTime = nextClassTime;
        const openTime = startTime - openToleranceBeforeMs; 
        const endTimeOfficial = startTime + classDurationMs;
        
        // NOVO CÁLCULO: Horário Limite de Entrada (10 minutos após o início oficial)
        const entryLimitTime = startTime + entryToleranceAfterStartMs; 
        
        const closeTimeWithTolerance = endTimeOfficial + closeToleranceAfterEndMs; 
        
        // 2. FORMATAR O HORÁRIO PARA BUSCAR NO MAPA
        const startHourString = new Date(startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // NOVO: Formatação completa da data e hora para exibição
        const fullDateString = new Date(startTime).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        
        // 3. BUSCAR O NOME DO ALUNO
        // Procura o nome com base no horário formatado ("HH:MM")
        const alunoProximo = studentSchedules[startHourString] || "Aluno(a)"; 
        
        // 4. ATUALIZAR O NOME NO HTML
        alunoSaudacao.innerHTML = `Olá, **${alunoProximo}**!`;

        const distanceToOpen = openTime - now;

        // Condição A: Sala Aberta & ENTRADA PERMITIDA (do openTime até o entryLimitTime)
        if (now >= openTime && now < entryLimitTime) {
            if (countdownInterval) clearInterval(countdownInterval);
            
            let message = '';
            
            if (now < startTime) {
                message = `<i class="fas fa-check-circle"></i> A Sala de Aula Particular (Professora) abre às **${startHourString}** e **JÁ ESTÁ DISPONÍVEL** para entrada antecipada.`;
            } else { // now >= startTime && now < entryLimitTime
                message = `<i class="fas fa-check-circle"></i> A aula das **${startHourString}** está em andamento. Entre **AGORA!** (Fechamento em ${Math.ceil((entryLimitTime - now) / 60000)} min)`;
            }
            
            aulaStatusDiv.innerHTML = `<p class="status-aberto">${message}</p>`;
            iniciarAulaBtn.style.display = 'block';
            
            return;
        }
        
        // Condição B: Entrada BLOQUEADA (do entryLimitTime até o closeTimeWithTolerance)
        if (now >= entryLimitTime && now < closeTimeWithTolerance) {
             if (countdownInterval) clearInterval(countdownInterval);
             aulaStatusDiv.innerHTML = `<p class="status-fechado"><i class="fas fa-lock"></i> **ENTRADA BLOQUEADA.** O limite de 10 minutos para iniciar a aula das ${startHourString} expirou.</p>`;
             iniciarAulaBtn.style.display = 'none';
             return;
        }


        // Condição C: Cronômetro Regressivo (Próxima Aula)
        if (distanceToOpen > 0) {
            iniciarAulaBtn.style.display = 'none';
            
            const distance = distanceToOpen;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            let timeString = '';
            if (days > 0) timeString += `${days}d `;
            if (hours > 0) timeString += `${hours}h `;
            timeString += `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

            // ALTERADO: Adiciona a data completa na mensagem
            aulaStatusDiv.innerHTML = `
                <p class="status-fechado"><i class="fas fa-clock"></i> Próxima aula particular: **${fullDateString}**. A sala abrirá em:</p>
                <div id="countdown-timer">${timeString}</div>
            `;
            return;
        }
    }

    // Inicializa a verificação e o cronômetro
    updateAulaStatus();
    countdownInterval = setInterval(updateAulaStatus, 1000);
}

// =================================================================
// FIM: AULAS PARTICULARES
// =================================================================


// =================================================================
// INÍCIO: AULAS EM GRUPO (Usa recorrência semanal fixa)
// =================================================================

function initializeGrupoAulaFeature() {
    const aulaStatusDiv = document.getElementById('aula-grupo-status');
    const iniciarAulaBtn = document.getElementById('iniciar-grupo-btn');
    const alunoSaudacao = document.querySelector('#aula-grupo-section .aluno-saudacao'); // SELECIONA O ELEMENTO DE SAUDAÇÃO PARA GRUPO
    
    // Mantém a saudação genérica para a área de grupo
    alunoSaudacao.innerHTML = `Olá, **Aluno(a)**!`;

    // Link do Zoom para AULAS EM GRUPO (PODE SER DIFERENTE DO PARTICULAR)
    const zoomLink = "https://zoom.us/j/seu_id_de_reuniao_grupo_aqui"; 
    iniciarAulaBtn.setAttribute('data-zoom-link', zoomLink);
    iniciarAulaBtn.href = zoomLink;

    // *****************************************************************
    // AJUSTE AQUI: HORÁRIO FIXO SEMANAL PARA AULA EM GRUPO
    // *****************************************************************
    const fixedSchedule = {
        // 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta
        // 0 = Domingo, 6 = Sábado
        dayOfWeek: 3, // EX: 3 para Quarta-feira (Ajuste conforme necessário)
        hour: 19,     // EX: 19:30
        minute: 30    // EX: 19:30
    };
    const startHourStringDisplay = `${fixedSchedule.hour.toString().padStart(2, '0')}:${fixedSchedule.minute.toString().padStart(2, '0')}`;
    // *****************************************************************

    // Duração e Tolerâncias
    const classDurationMs = 60 * 60 * 1000;         // 1 hora
    const openToleranceBeforeMs = 10 * 60 * 1000;   // Sala abre 10 minutos antes
    const closeToleranceAfterEndMs = 30 * 60 * 1000; // Sala fecha 30 minutos após o término oficial

    let countdownInterval;

    // Função interna para calcular a próxima recorrência semanal
    function getNextWeeklyClassTime() {
        const now = new Date();
        const targetDay = fixedSchedule.dayOfWeek;
        const targetHour = fixedSchedule.hour;
        const targetMinute = fixedSchedule.minute;
        
        let nextClass = new Date(now);
        nextClass.setHours(targetHour, targetMinute, 0, 0);

        // 1. Calcula a diferença de dias entre o dia da semana atual e o dia alvo
        let dayDifference = targetDay - nextClass.getDay();

        if (dayDifference === 0) {
            // É hoje. Verifica se a aula já passou (incluindo tolerância de fechamento).
            const classStartMs = nextClass.getTime();
            const closeTime = classStartMs + classDurationMs + closeToleranceAfterEndMs;
            if (now.getTime() >= closeTime) {
                // A aula de hoje já passou, calcula para a próxima semana.
                dayDifference = 7;
            }
        } else if (dayDifference < 0) {
            // O dia da semana já passou nesta semana. Calcula para a próxima semana.
            dayDifference += 7;
        } 
        
        // 2. Avança a data pelo número de dias calculado
        nextClass.setDate(nextClass.getDate() + dayDifference);

        return nextClass.getTime();
    }


    function updateGrupoAulaStatus() {
        const now = new Date().getTime();
        
        // Usa a nova lógica de recorrência semanal
        const nextClassTime = getNextWeeklyClassTime();

        if (!nextClassTime) {
             // Caso de fallback (embora improvável com recorrência semanal)
            if (countdownInterval) clearInterval(countdownInterval);
            aulaStatusDiv.innerHTML = `<p class="status-fechado"><i class="fas fa-times-circle"></i> O calendário de aulas em grupo foi desativado temporariamente.</p>`;
            iniciarAulaBtn.style.display = 'none';
            return;
        }

        const startTime = nextClassTime;
        const openTime = startTime - openToleranceBeforeMs; 
        const endTimeOfficial = startTime + classDurationMs; 
        const closeTimeWithTolerance = endTimeOfficial + closeToleranceAfterEndMs; 
        
        // NOVO: Formatação completa da data e hora para exibição
        const fullDateString = new Date(startTime).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        
        const distanceToOpen = openTime - now;

        // Condição A: Sala Aberta (Entrada Permitida)
        if (now >= openTime && now < closeTimeWithTolerance) {
            if (countdownInterval) clearInterval(countdownInterval);
            
            let message = '';
            
            if (now < startTime) {
                message = `<i class="fas fa-check-circle"></i> A Sala de Grupo (Alunos) abre às **${startHourStringDisplay}** e **JÁ ESTÁ DISPONÍVEL** para entrada antecipada.`;
            } else if (now >= startTime && now < endTimeOfficial) {
                message = `<i class="fas fa-check-circle"></i> A aula de Grupo das **${startHourStringDisplay}** está em andamento. **ENTRE AGORA!**`;
            } else { 
                message = `<i class="fas fa-check-circle"></i> A aula de Grupo das **${startHourStringDisplay}** encerrou, mas a sala ainda está aberta.`;
            }
            
            aulaStatusDiv.innerHTML = `<p class="status-aberto">${message}</p>`;
            iniciarAulaBtn.style.display = 'block';
            
            return;
        }

        // Condição B: Cronômetro Regressivo (Próxima Aula)
        if (distanceToOpen > 0) {
            iniciarAulaBtn.style.display = 'none';
            
            const distance = distanceToOpen;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            let timeString = '';
            if (days > 0) timeString += `${days}d `;
            if (hours > 0) timeString += `${hours}h `;
            timeString += `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;

            // ALTERADO: Adiciona a data completa na mensagem
            aulaStatusDiv.innerHTML = `
                <p class="status-fechado"><i class="fas fa-clock"></i> Próxima aula em grupo: **${fullDateString}**. A sala abrirá em:</p>
                <div id="countdown-timer">${timeString}</div>
            `;
            return;
        }
    }

    // Inicializa a verificação e o cronômetro
    updateGrupoAulaStatus();
    countdownInterval = setInterval(updateGrupoAulaStatus, 1000);
}
// =================================================================
// FIM: AULAS EM GRUPO
// =================================================================

// Chame as funções de inicialização após o carregamento do DOM
initializeAulaFeature(); // Chama a função da primeira seção (Aulas ao Vivo - Particulares)
initializeGrupoAulaFeature(); // Chama a função da segunda seção (Aulas em Grupo)
});
