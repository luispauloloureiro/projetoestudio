// Fotos de cada serviço (pra galeria)
const fotosDisponiveis = {
    'design-sobrancelhas': [
        'dsb01.jpg'
    ],
    'brow-lamination': [
        'brw01.jpg',
        'brw02.jpg',
        'brw03.jpg',
        'brw04.jpg',
        'brw05.jpg',
        'brw06.jpg',
        'brw07.jpg'
    ],
    'lash-lifting': [
        'lsh01.jpg',
        'lsh02.jpg',
        'lsh03.jpg',
        'lsh04.jpg'
    ],
    'unhas': [
        'unh01.jpg',
        'unh02.jpg',
        'unh03.jpg',
        'unh04.jpg',
        'unh05.jpg',
        'unh06.jpg',
        'unh07.jpg',
        'unh08.jpg',
        'unh09.jpg',
        'unh10.jpg',
        'unh11.jpg',
        'unh12.jpg',
        'unh13.jpg',
        'unh14.jpg',
        'unh15.jpg',
        'unh16.jpg',
        'unh17.jpg'
    ],
    'extensao-cilios': [
        'ext01.jpg',
        'ext02.jpg',
        'ext03.jpg',
        'ext04.jpg'
    ]
};

// Qual pasta tá cada serviço (pra montar o caminho)
const pastasServicos = {
    'design-sobrancelhas': 'design-de-sobrancelhas', // agora com hífen
    'brow-lamination': 'brow',
    'lash-lifting': 'lash-lifting', // agora com hífen
    'unhas': 'unhas',
    'extensao-cilios': 'extensao_cilios'
};

// Mistura a ordem do array (pra galeria ficar diferente sempre)
function embaralharArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Abre o pop-up da galeria de fotos
function abrirGaleriaModal(servico) {
    const modal = document.getElementById('galeria-modal');
    const modalTitulo = document.getElementById('galeria-modal-titulo');
    const modalGrid = document.getElementById('galeria-modal-grid');
    
    // Nome bonitinho pra cada serviço
    const titulos = {
        'design-sobrancelhas': 'Design de Sobrancelhas',
        'lash-lifting': 'Lash Lifting',
        'brow-lamination': 'Brow Lamination',
        'unhas': 'Unhas',
        'limpeza-pele': 'Limpeza de Pele - Antes e Depois',
        'extensao-cilios': 'Extensão de Cílios'
    };
    
    // Fotos antes/depois só pra limpeza de pele
    const fotosLimpezaPele = [
        { src: 'imagens/resultado/limpeza_pele/lmp01.jpg', alt: 'Antes' },
        { src: 'imagens/resultado/limpeza_pele/lmp02.jpg', alt: 'Depois' }
    ];
    
    modalTitulo.textContent = titulos[servico] || servico;
    modalGrid.innerHTML = '';
    
    // Carrega as fotos do serviço clicado
    if (servico === 'limpeza-pele') {
        fotosLimpezaPele.forEach(foto => {
            const img = document.createElement('img');
            img.src = foto.src;
            img.alt = foto.alt;
            img.loading = 'lazy';
            modalGrid.appendChild(img);
        });
    } else {
        const fotos = fotosDisponiveis[servico];
        const pasta = pastasServicos[servico];
        
        if (fotos && pasta) {
            // Mistura as fotos toda vez que abre
            const fotosEmbaralhadas = embaralharArray(fotos);
            
            fotosEmbaralhadas.forEach(foto => {
                const img = document.createElement('img');
                img.src = `imagens/resultado/${pasta}/${foto}`;
                img.alt = titulos[servico];
                img.loading = 'lazy';
                modalGrid.appendChild(img);
            });
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fecha o pop-up da galeria
function fecharGaleriaModal() {
    const modal = document.getElementById('galeria-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Botão de som do vídeo principal (hero)
function configurarMudoVideoHero() {
    const botaoMudo = document.getElementById('hero-mute-toggle');
    
    // Como estamos usando iframe do Google Drive, o controle de mudo é feito automaticamente
    if (botaoMudo) {
        botaoMudo.style.display = 'none';
    }
}

// Função para configurar a reprodução do vídeo
function configurarReproducaoVideo() {
    const elementoVideo = document.getElementById('sobre-video');
    if (!elementoVideo) {
        // Se não houver vídeo, tenta configurar o botão com base na imagem placeholder
        const botaoMudo = document.getElementById('mute-toggle');
        if (botaoMudo) {
            botaoMudo.style.display = 'none'; // Esconde o botão se não houver vídeo
        }
        return;
    }
    
    // Reprodução automática silenciosa apenas quando o vídeo está visível
    elementoVideo.muted = true;
    elementoVideo.volume = 1;

    // Botão de silenciar/desilenciar
    const botaoMudo = document.getElementById('mute-toggle');
    const atualizarRotuloMudo = () => {
        if (!botaoMudo) return;
        botaoMudo.textContent = elementoVideo.muted ? '🔇' : '🔊';
        botaoMudo.setAttribute('aria-pressed', (!elementoVideo.muted).toString());
    };
    
    if (botaoMudo) {
        botaoMudo.addEventListener('click', () => {
            elementoVideo.muted = !elementoVideo.muted;
            if (!elementoVideo.paused) {
                elementoVideo.play().catch(err => console.log('Reprodução com som impedida:', err));
            }
            atualizarRotuloMudo();
        });
        atualizarRotuloMudo();
    }
    
    // Intersection Observer para reproduzir vídeo apenas quando visível
    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                elementoVideo.play().catch(err => console.log('Reprodução automática impedida:', err));
            } else {
                elementoVideo.pause();
            }
        });
    }, { threshold: 0.5 });
    
    observador.observe(elementoVideo);
}

document.addEventListener('DOMContentLoaded', function () {
    // Inicializar reprodução de vídeo na seção "Sobre Nós"
    configurarReproducaoVideo();
    
    // Configurar botão de mudo para vid1 (hero)
    configurarMudoVideoHero();
    
    // Ouvintes de evento para cartões do portfólio
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function() {
            const servico = this.getAttribute('data-servico');
            abrirGaleriaModal(servico);
        });
    });
    
    // Ouvinte de evento para fechar modal
    const modalClose = document.querySelector('.galeria-modal-close');
    const modal = document.getElementById('galeria-modal');
    
    if (modalClose) {
        modalClose.addEventListener('click', fecharGaleriaModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharGaleriaModal();
            }
        });
    }
    
    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharGaleriaModal();
        }
    });
    
    const hamburguer = document.querySelector('.hamburger');
    const linksNavegacao = document.querySelector('.nav-links');
    const barraNavegacao = document.querySelector('.navbar');

    function alternarMenu() {
        linksNavegacao.classList.toggle('active');
        hamburguer.classList.toggle('active');
    }

    if (hamburguer) hamburguer.addEventListener('click', alternarMenu);

    // Fechar menu móvel ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (linksNavegacao.classList.contains('active')) alternarMenu();
        });
    });

    // Garantir que a barra de navegação esteja sempre visível
    function manterBarraNavegacaoVisivel() {
        if (barraNavegacao) {
            barraNavegacao.style.setProperty('position', 'fixed', 'important');
            barraNavegacao.style.setProperty('top', '0', 'important');
            barraNavegacao.style.setProperty('transform', 'translateY(0)', 'important');
            barraNavegacao.style.setProperty('visibility', 'visible', 'important');
            barraNavegacao.style.setProperty('opacity', '1', 'important');
            barraNavegacao.style.setProperty('display', 'flex', 'important');
            barraNavegacao.style.setProperty('z-index', '1000', 'important');
        }
    }
    
    // Aplicar imediatamente
    manterBarraNavegacaoVisivel();
    
    // Observar mudanças na barra de navegação e corrigir se necessário
    const observadorBarraNavegacao = new MutationObserver(() => {
        manterBarraNavegacaoVisivel();
    });
    
    if (barraNavegacao) {
        observadorBarraNavegacao.observe(barraNavegacao, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    // Manipulação eficiente de rolagem (evitar escritas repetidas de estilo)
    let rolado = false;
    window.addEventListener('scroll', () => {
        const deveEstarRolado = window.scrollY > 50;
        if (deveEstarRolado !== rolado) {
            rolado = deveEstarRolado;
            if (rolado) {
                barraNavegacao.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                barraNavegacao.style.backgroundColor = 'rgba(248,242,237,0.98)';
                barraNavegacao.style.padding = '0.8rem 5%';
            } else {
                barraNavegacao.style.boxShadow = 'none';
                barraNavegacao.style.backgroundColor = 'rgba(248,242,237,0.98)';
                barraNavegacao.style.padding = '1rem 5%';
            }
        }
    });

    // IntersectionObserver para animações de entrada (apenas adicionar classes)
    const observadorAnimacoes = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate', 'animate-show');
                observadorAnimacoes.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    const elementosParaAnimar = document.querySelectorAll('.diferencial-card, .servico-card, .foto-item, .depoimento-card, .blog-post, h2:not(.navbar h2), p:not(.navbar p), .masculino-item, .info-item');
    elementosParaAnimar.forEach((el, i) => {
        // Definir apenas estado inline mínimo para evitar problemas de layout
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${(i % 6) * 0.05}s`;
        observadorAnimacoes.observe(el);
    });

    // Função auxiliar debounce para evitar chamadas excessivas
    const debounce = (fn, delay = 150) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // Reiniciar movimentos suaves no site sem ocultar elementos
    const seletoresAnimados = [
        '.sobre-texto h2',
        '.sobre-texto p',
        '.listas-sobre h3',
        '.listas-sobre li',
        '.hero-text-wrapper p',
        '.hero-text-wrapper .hero-text',
        '.diferencial-card',
        '.servico-card',
        '.foto-item',
        '.depoimento-card',
        '.blog-post',
        '.masculino-item',
        '.info-item'
    ];

    const nosAnimados = Array.from(document.querySelectorAll(seletoresAnimados.join(', ')));

    const reiniciarAnimacoes = () => {
        if (!nosAnimados.length) return;
        nosAnimados.forEach((el, idx) => {
            // Nunca animar a barra de navegação
            if (el.closest('.navbar') || el.classList.contains('navbar')) return;
            const computado = window.getComputedStyle(el);
            const animacaoAtual = computado.animationName === 'none' ? 'softRise' : computado.animationName;
            const atraso = (idx % 8) * 0.04;
            el.style.animation = 'none';
            el.style.opacity = computado.opacity || '1';
            void el.offsetWidth;
            el.style.animation = `${animacaoAtual} 0.8s ease-out forwards`;
            el.style.animationDelay = `${atraso}s`;
        });
    };

    const reiniciarComDebounce = debounce(reiniciarAnimacoes, 180);
    window.addEventListener('resize', reiniciarComDebounce);
    window.addEventListener('orientationchange', reiniciarAnimacoes);
    window.addEventListener('scroll', reiniciarComDebounce);
    setTimeout(reiniciarAnimacoes, 300);

    // Efeito de digitação simples (mantido mas com velocidade reduzida)
    const tituloHero = document.querySelector('.hero-content h1');
    if (tituloHero) {
        const textoOriginal = tituloHero.textContent.trim();
        tituloHero.textContent = '';
        let i = 0;
        const temporizadorDigitacao = setInterval(() => {
            tituloHero.textContent += textoOriginal.charAt(i);
            i++;
            if (i >= textoOriginal.length) {
                clearInterval(temporizadorDigitacao);
                tituloHero.classList.add('animate');
            }
        }, 60);
    }

    // Rolagem suave para links de âncora (com fallback seguro)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const alvo = document.querySelector(href);
            if (alvo) {
                e.preventDefault();
                window.scrollTo({ top: alvo.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Animação de contador usando IntersectionObserver (comportamento inalterado)
    const contadores = document.querySelectorAll('.counter');
    if (contadores.length) {
        const animarContador = (contador) => {
            const alvo = parseInt(contador.dataset.target || '0', 10);
            const duracao = 1400;
            let inicio = null;
            function passo(ts) {
                if (!inicio) inicio = ts;
                const progresso = Math.min((ts - inicio) / duracao, 1);
                contador.innerText = Math.ceil(progresso * alvo);
                if (progresso < 1) requestAnimationFrame(passo);
            }
            requestAnimationFrame(passo);
        };

        const observadorContador = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animarContador(entry.target);
                    observadorContador.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        contadores.forEach(c => observadorContador.observe(c));
    }

    // Detecção de dispositivo móvel
    const isMobile = () => window.innerWidth <= 768;

    // Interações táteis simplificadas (usar css :active quando possível)
    if (isMobile()) {
        document.body.style.willChange = 'transform';
    }

    // ===== DESEMPENHO: interações otimizadas do mouse =====
    const seletorInterativo = '.diferencial-card, .servico-card, .foto-item, .depoimento-card, .blog-post, .sobre-imagem';
    const cartoesInterativos = Array.from(document.querySelectorAll(seletorInterativo));
    const secoes = Array.from(document.querySelectorAll('section'));

    let mouseX = 0, mouseY = 0, rafPendente = false;

    function lidarComFrameDoMouse() {
        rafPendente = false;
        const clientX = mouseX;
        const clientY = mouseY;

        // Limitar trabalho: afetar apenas até 12 cartões mais próximos
        const maxCartoesParaProcessar = 12;
        const distanciasCartoes = cartoesInterativos.map(card => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = clientX - cx;
            const dy = clientY - cy;
            const dist = Math.hypot(dx, dy);
            return { card, rect, dx, dy, dist };
        });

        distanciasCartoes.sort((a, b) => a.dist - b.dist);

        distanciasCartoes.slice(0, maxCartoesParaProcessar).forEach(({ card, rect, dx, dy, dist }) => {
            if (dist < 350) {
                const deltaX = (dx / rect.width) * 5;
                const deltaY = (dy / rect.height) * 5;
                card.style.transform = `perspective(900px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg) scale(1.02)`;
                card.style.willChange = 'transform';
            } else {
                card.style.transform = '';
            }
        });

        // Parallax para seções (leve)
        const nx = clientX / window.innerWidth - 0.5;
        const ny = clientY / window.innerHeight - 0.5;
        secoes.forEach((section, idx) => {
            const velocidade = ((idx % 3) + 1) * 0.6; // valores menores
            section.style.transform = `translate(${nx * velocidade}px, ${ny * velocidade}px)`;
        });
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafPendente) {
            rafPendente = true;
            requestAnimationFrame(lidarComFrameDoMouse);
        }
    });

    // Resetar transformações ao sair
    document.addEventListener('mouseleave', () => {
        cartoesInterativos.forEach(c => c.style.transform = '');
        secoes.forEach(s => s.style.transform = '');
    });

    // Efeitos de hover na navegação (mantidos, mas com escritas inline mínimas)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('mouseenter', () => link.classList.add('nav-hover'));
        link.addEventListener('mouseleave', () => link.classList.remove('nav-hover'));
    });

    // Interações de botões e efeito ripple
    const todosBotoes = document.querySelectorAll('button, .agendar-btn, .agendar-link');
    todosBotoes.forEach(botao => {
        botao.addEventListener('mousedown', () => botao.classList.add('btn-press'));
        botao.addEventListener('mouseup', () => botao.classList.remove('btn-press'));
        botao.addEventListener('mouseleave', () => botao.classList.remove('btn-press'));
    });

    const botoesComRipple = document.querySelectorAll('button, .agendar-btn');
    botoesComRipple.forEach(botao => {
        botao.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            const rect = this.getBoundingClientRect();
            const tamanho = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - tamanho / 2;
            const y = e.clientY - rect.top - tamanho / 2;
            ripple.style.width = ripple.style.height = tamanho + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Cursor personalizado: apenas para desktop e implementação leve
    if (!isMobile()) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-inner"></div>';
        document.body.appendChild(cursor);
        let cX = 0, cY = 0, tX = 0, tY = 0;
        document.addEventListener('mousemove', (e) => { tX = e.clientX; tY = e.clientY; });
        const animarCursor = () => {
            cX += (tX - cX) * 0.15;
            cY += (tY - cY) * 0.15;
            cursor.style.transform = `translate(${cX}px, ${cY}px)`;
            requestAnimationFrame(animarCursor);
        };
        requestAnimationFrame(animarCursor);

        document.querySelectorAll('a, button, .agendar-btn, .agendar-link').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }
    // Garantir que todas as imagens tenham carregamento preguiçoso nativo onde suportado
    try {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        });
    } catch (e) {
        // Fallback silencioso para navegadores muito antigos
    }

    // Modal: Política de Agendamento e Cancelamento
    (function () {
        const linkPolitica = document.getElementById('politica-link');
        const modalPolitica = document.getElementById('politica-modal');
        if (!linkPolitica || !modalPolitica) return;

        const sobreposicao = modalPolitica.querySelector('.modal-overlay');
        const botaoFechar = modalPolitica.querySelector('.modal-close');

        function abrirModal() {
            modalPolitica.classList.add('active');
            modalPolitica.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (botaoFechar) botaoFechar.focus();
        }

        function fecharModal() {
            modalPolitica.classList.remove('active');
            modalPolitica.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            linkPolitica.focus();
        }

        linkPolitica.addEventListener('click', function (e) {
            e.preventDefault();
            abrirModal();
        });

        if (botaoFechar) botaoFechar.addEventListener('click', fecharModal);
        if (sobreposicao) sobreposicao.addEventListener('click', fecharModal);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalPolitica.classList.contains('active')) fecharModal();
        });
    })();

    // (comparador removido)
});