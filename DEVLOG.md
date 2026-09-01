# 🛠️ DevLog - SAO (Sistema de Administração e Operações)

Este documento registra as principais atualizações, melhorias e correções feitas no projeto.
O formato ideal para cada entrada é misturar uma linguagem amigável (excelente para a comunidade no Discord) com a organização técnica que os desenvolvedores amam no GitHub.

---

## 🚀 [0.6.0] - 08-2026

**"Novas Ferramentas: Cofre de Senhas, SenhaDB e Licenças Temporárias"**

### 🗄️ Novo Módulo: Cofre de Senhas

- **Cofres Pessoais e Coletivos**: Gerencie suas senhas de forma segura! Crie cofres individuais ou espaços coletivos para compartilhar acessos estratégicos com o seu setor.
- **Gestão de Permissões Granular**: Compartilhamento inteligente com 4 níveis de acesso: **Leitura** (apenas visualizar), **Criação** (adicionar novas), **Edição** (modificar existentes) e **Total** (poderes de arquivar e excluir definitivamente).
- **Ações em Lote**: Ganhe produtividade selecionando várias senhas simultaneamente para arquivar, restaurar ou apagar do arquivo morto.
- **Importação Inteligente (KeePass CSV)**: Migrar de outros gerenciadores ficou incrivelmente simples. O sistema permite a importação direta de arquivos `.csv` e lida automaticamente com anomalias de formatação e colunas em branco.
- **Segurança Reforçada (PIN Master e Auto-Lock)**: Criamos uma camada dupla de proteção. O Cofre agora exige a criação de um PIN. Caso se afaste do PC, um cronômetro invisível de inatividade trava o cofre automaticamente após 5 minutos, blindando o conteúdo e exigindo o PIN ou senha para voltar a exibir os dados.
- **Performance Extrema**: Otimizamos radicalmente o motor do painel para aguentar milhares de senhas. Com técnicas avançadas de renderização (Memoization), interagir com as senhas, buscar ou copiar credenciais acontece de forma instantânea, zero engasgos.
- **Visual Responsivo**: Toda a interface do Cofre de Senhas já está adaptada para o novo padrão de _Cores Dinâmicas_, acompanhando nativamente a identidade visual do módulo sem engessar a UI.

### 🔐 Módulo SenhaDB

- **Descriptografia Local (INFO.001)**: Agora o SAO conta com um módulo nativo, acessível diretamente na Home (para usuários com permissão), capaz de ler e extrair senhas de arquivos `INFO.001` do DOC-Windows.
- **Rapidez e Segurança**: Basta arrastar o arquivo para a tela. Todo o processamento é feito localmente e instantaneamente, revelando a senha em um painel com botão de "Copiar para Área de Transferência".

### ⏳ Módulo Licença Temporária

- **Geração Ágil de Contra-Senhas**: Precisa estender a licença de um cliente? O novo módulo permite gerar as contra-senhas temporárias do DOC-Windows em segundos!
- **Flexibilidade Total**: Escolha o prazo facilmente digitando um período numérico e selecionando entre **Dias, Meses ou Anos** no menu, ou simplesmente escolha a data final no calendário bidirecional.
- **Formatação Original**: O sistema replica com perfeição a formatação matemática do antigo bot, devolvendo a numeração já separada por traços para colar direto no sistema ou no WhatsApp do cliente.

### 📅 Agenda Turbinada (Drag & Drop e UX)

- **Arrastar e Soltar (Drag & Drop)**: Remanejar agendamentos nunca foi tão fácil! Agora você pode clicar, segurar e arrastar um evento diretamente para outro dia ou horário. O sistema também respeita suas permissões de edição!
- **Redimensionamento Rápido**: Precisou estender ou encurtar a duração de um atendimento? Basta puxar a borda inferior do agendamento diretamente no calendário para ajustar o tempo com precisão.
- **Legibilidade e Organização Visual**:
  - As etiquetas (badges) dos usuários responsáveis agora são renderizadas em destaque, sem problemas de ocultação por transparência.
  - Eventos de mesma cor seguidos agora possuem um contorno sutil, impedindo que pareçam um bloco visual único.
- **Nomes de Exibição (Display Name)**: O card de detalhes do evento passou a valorizar o "Nome de Exibição" configurado pelo usuário, e o gerador de siglas padrão (fallback) subiu de 2 para 3 caracteres, facilitando bater o olho e reconhecer a equipe!

---

## 🚀 [0.5.2] - 08-2026

### 🛠️ Correções e Melhorias (Módulos Webview)

- **Controle de Abas Internas**: Agora, os módulos que funcionam por webview (como Intranet) suportam abas internas nativamente! Sempre que um link exigir uma nova janela (seja por um clique do meio ou `target="_blank"`), o SAO abrirá uma aba na própria barra do módulo, melhorando drasticamente a navegação.
- **Correção da Tela Preta em Múltiplos Monitores**: Resolvemos um bug no mecanismo de renderização do Windows (`WebView2`). Janelas desacopladas que eram arrastadas para monitores com escalas ou resoluções diferentes não ficarão mais com a tela preta travada. Agora, cada janela filha gera sua própria instância independente e isolada, sendo 100% à prova de trocas de monitor.

---

## 🚀 [0.5.1] - 08-2026

### 🪟 Abas Desacopladas (Multi-Monitores)

- **Liberdade de Trabalho**: Agora você pode desacoplar abas dos módulos principais! Basta arrastar a aba para fora da barra (ou clicar com o botão direito e escolher a opção) para transformá-la em uma janela independente nativa do Windows. Perfeito para quem trabalha com dois ou mais monitores e quer, por exemplo, deixar a Agenda em uma tela e o Editor de Textos na outra.
- **Desempenho e Persistência "Lazy"**: As janelas desacopladas nascem sabendo exatamente qual módulo carregar (ex: `SAO - Editor de Textos`). Otimizamos radicalmente os componentes mais pesados (como o Corretor Ortográfico) para carregar no fundo de forma assíncrona, garantindo que a nova janela abra instantaneamente sem engasgos.

### 📅 Integração Agenda x Clientes (CLC)

- **Vínculo Rápido e Direto**: Adicionamos o campo inteligente `Cliente (Opcional)` aos modais de agendamento. Agora você pode pesquisar por código e nome para vincular agendamentos aos clientes do CLC, disponível em todos os métodos de criação (Único, em Lote ou Sequência).
- **Zero Lentidão**: Implementado através do HTML5 nativo (`datalist`), o componente exibe a lista completa da base de clientes na velocidade da luz e sem nenhum "engasgo", substituindo componentes Dropdowns pesados.
- **Pensando no Futuro**: A ligação robusta que criamos através da coluna `cod_clc` no banco de dados PostgreSQL é o primeiro passo para no futuro permitir visualizar _todo_ o histórico e formulários atrelados a um único cliente num piscar de olhos.

### 🎯 Refinamentos Visuais e Funcionais na Agenda

- **Escala de Tempo Ampliada**: Aumentamos o espaçamento vertical das visões de Dia e Semana, garantindo que textos e badges caibam sem sufoco nas linhas. Além disso, a visão inicial do calendário agora tem seu "scroll" padrão posicionado nas **08:00h**, facilitando a navegação diária.
- **Melhoria Absurda na Visão Mensal**:
  - Acabamos com os _popups_ quebrados padrão do calendário quando muitos eventos tentam disputar o mesmo dia! Agora um botão discreto **"Mais X"** aparece no rodapé do dia. Ao clicar, um **Modal Dialog** focado e elegante é aberto listando todos os eventos extras.
  - Eventos na visão mensal agora exibem nativamente as badges dos participantes para bater o olho e saber quem está envolvido, com um limite de até **3 badges**. Caso a equipe seja maior, um botão inteligente de reticências (`...`) exibe o resto da turma ao passar o mouse (_tooltip list_).
- **Lapidação do Modo Escuro**: A janela de "Configurações da Agenda" ganhou um banho de loja no Dark Mode. Ajustamos as paletas e caixas de lembretes para que utilizem a cor padrão de fundo do painel e sigam o requinte de todos os outros módulos do SAO.
- **Hierarquia Inteligente nos Lembretes**: Removemos o gargalo nas configurações de WhatsApp das Agendas Setoriais. Agora, qualquer membro com perfil **Sênior** ou superior no sistema terá automaticamente a permissão para gerenciar a **Duração Padrão** de agendamento e configurar o disparo de lembretes sem precisar que um diretor altere a configuração.

---

## 🚀 [0.5.0] - 08-2026

**"Pequenos Detalhes, Grandes Impactos: O Mini Editor Cresceu e o CLC Chegou!"**

### 🏢 Novo Módulo: Clientes e Licenças (CLC)

O coração administrativo agora pulsa dentro do SAO! O novo módulo CLC traz toda a base de clientes do sistema legado para uma interface moderna, unificada e ultra-rápida.

- **Busca e Filtros Inteligentes**: Encontre clientes em milissegundos pesquisando por nome, código, CNPJ, CPF ou nome oficial. Filtre instantaneamente por status (Regular, Inadimplente, Implantação).
- **Sincronização Invisível**: O módulo verifica sozinho o servidor de arquivos a cada acesso (respeitando cooldowns) e se atualiza automaticamente em background sem travar a tela, garantindo que os dados em cache estejam sempre sincronizados com a base original da empresa.
- **Cópia Rápida (1-Click)**: Extratos práticos e rápidos dos módulos contratados pelo cliente. Copie siglas dos módulos diretamente (`NCOEw`) ou gere listas amigáveis para colar no WhatsApp.

⚠️ **ATENÇÃO** ⚠️

```plaintext
Os módulos exibidos ainda não refletem com precisão o status de ativação no cliente. Por favor, valide sempre os módulos ativos diretamente no CLC original ou via SAC.
```

### ✍️ Evolução do Mini Editor de Textos (Addon)

- **Aproveitamento de Espaço Inteligente**: Corrigido um gap visual no final do modal do Mini Editor. Agora, a área de digitação de texto expande automaticamente preenchendo toda a área disponível do modal de forma natural e elegante.
- **Menu de Contexto Inteligente (Bubble Menu)**: Adicionado um menu flutuante muito mais fluido! Agora, ao selecionar qualquer texto dentro do Mini Editor, um menu de acesso rápido aparecerá exatamente sobre a seleção, facilitando a aplicação de formatações (Negrito, Itálico, Sublinhado e Tachado) sem precisar mover o mouse até a barra superior.
- **Formatação de Código Inline**: Atendendo a pedidos, o Mini Editor agora conta com o botão de formatação de código `</>`, exatamente como no Editor Principal, tornando-o perfeito para formatar comandos, caminhos de arquivo ou trechos de scripts de forma destacada.

### 🌐 Integração Webview Avançada (SAC, PABX, WhatsApp e Intranet)

- **Pop-ups 100% Nativos**: Resolvemos o bloqueio de novas abas nos módulos web (como SAC e Intranet). Agora, quando o sistema tentar abrir um pop-up ou impressão de PDF via JavaScript, a interface intercepta e abre uma **janela nativa do Windows independente**, trazendo uma usabilidade idêntica à do Google Chrome.
- **Sincronização Mágica de Credenciais**: O recurso de salvar senhas não é mais exclusivo. Expandimos e padronizamos a captura inteligente de login para todos os módulos (SAC, PABX, WhatsApp e Intranet).
- **Segurança Criptografada**: Privacidade é inegociável! Todas as senhas salvas para o preenchimento automático são fortemente criptografadas antes de serem armazenadas no banco de dados, protegendo contra qualquer vazamento de dados.
- **Otimização Extrema (Cache + Nuvem)**: As senhas salvas ganharam superpoderes! Elas agora ficam armazenadas no cache local (`localStorage`) para um carregamento ultra-rápido, mas são espelhadas silenciosamente no banco de dados. Formatar o PC ou trocar de máquina não é mais um problema: seu login segue com você e o preenchimento automático funciona sem engasgos.

---

## 🚀 [0.4.16] - 08-2026

**"O Fim do F5 nas Imagens e a Nova Vida do Visualizador"**

E aí, pessoal! A versão `0.4.16` traz uma correção cirúrgica mas que impacta muito no dia a dia, especialmente para quem trabalha muito com prints e imagens dentro do editor de texto. Adeus à tela em branco!

### 🖼️ Melhorias no Visualizador de Imagens (Editor)

- **Renderização Imediata (Fim do F5!)**: Sabe aquele bug chato onde você clicava em uma imagem colada (em `base64`) e a nova aba abria em branco, te obrigando a apertar F5? Foi resolvido! Agora as imagens renderizam na hora.
- **Segurança e Performance**: Joguei fora o antigo `document.write` e reescrevi a lógica de abertura de imagens em nova guia usando manipulação limpa do DOM (`document.createElement`). Isso não só resolve o bug do F5, mas deixa o carregamento mais seguro e fluido.
- **Correção de Links de Imagem**: Havia um pequeno erro onde o sistema tentava forçar um `https://` na frente do código `base64` da imagem, quebrando a URL. O sistema agora é inteligente o suficiente para identificar e respeitar links de protocolo `data:`.
- **Melhoria no Fallback (Tauri)**: A comunicação nativa em Rust (`open_image_in_browser`) agora se integra de forma ainda mais suave ao comportamento do frontend para renderizar o visualizador em novas janelas com suporte a zoom nativo.

---

## 🚀 [0.4.15] - 08-2026

**"O Renascimento do Chat, Auto-Updates Mágicos e Fim da Ansiedade"**

Fala pessoal! Muita coisa aconteceu desde a versão `0.4.14`. Trabalhei duro nos bastidores para trazer atualizações massivas que mudam completamente a forma como vocês interagem dentro do SAO. Pegue um café e confira a lista gigantesca do que mudou:

### 📝 Novo Editor de Texto (Sincronização Nuvem)

- **Salvamento Automático Robusto**: Agora o Editor de Texto salva seus documentos diretamente no banco de dados, além de manter uma cópia rápida no navegador (_Local Storage_).
  - **O ganho prático:** Se você mudar de computador, limpar o cache do navegador ou formatar o PC, **seus textos não serão mais perdidos**, pois estarão sincronizados com a nuvem! (Lembrando que os textos não bloqueados ficam salvos no banco por 90 dias).
- **Privacidade Garantida**: Para a sua tranquilidade, todos esses dados salvos no banco são rigorosamente criptografados, garantindo a total privacidade dos textos de cada usuário.
- **Imagens Otimizadas**: Fiz uma otimização profunda no tratamento das imagens auto-hospedadas dentro do Editor de Texto, melhorando significativamente a qualidade visual e o comportamento do visualizador de imagens embutido.

### 💬 ComuChat: Agora é Oficialmente um Monstro

- **Novo Editor de Texto (Tiptap)**: O chat recebeu um upgrade absurdo. Agora há suporte para emojis nativos, blocos de código formatados e links customizados!
- **Sistema de Menções Completo**: Agora você pode digitar `@` e mencionar não apenas **Usuários**, mas também **Setores** e **Cargos**. Falar com a pessoa certa nunca foi tão fácil.
- **Mensagens Fixadas**: Informação importante no canal? Agora você pode fixar (_pin_) mensagens para que ninguém perca os avisos cruciais.
- **Gestão de Comunidades**: Adicionei painéis completos para administração de membros, atribuição de cargos e até exclusão de comunidades, dando total controle aos administradores.

### 🔔 Notificações e Agenda: O Poder é Seu

- **Granularidade Máxima no ComuChat**: Nas Configurações, você agora decide exatamente o que aciona um alerta (Todas as mensagens, Menções, Cargos ou DMs) _separadamente_ para os seus status (Disponível, Ocupado ou Ausente). Escolha se quer som, pop-up ou apenas silêncio.
- **Integração de Agenda com WhatsApp**: Implementei um sistema robusto de gestão de agendas que agora conta com configurações para disparar notificações automáticas via WhatsApp.
- **Sons Elegantes para Status Temporários**: Colocou o status em "Almoço" por 60 minutos? O sistema te avisará com um suave efeito sonoro de piano assim que o timer expirar.

### ⚡ Infraestrutura e Qualidade de Vida (QoL)

- **Atualizações Silenciosas via GitHub**: Diga adeus ao antigo servidor IIS! Migrei todo o sistema de entrega de atualizações para o _GitHub Releases_. O SAO agora baixa atualizações silenciosamente no fundo e os instaladores lidam automaticamente com os certificados.
- **Nova Arquitetura Core (Tauri v2)**: Reconstruí a base do aplicativo para suportar múltiplas abas (multi-tab layout) e uma navegação muito mais rápida e fluida.
- **Visualizador Unificado de Scripts SQL**: Para otimizar a parte técnica, criei um novo componente dedicado à visualização unificada de scripts do banco.

### 🐛 Correções de Estabilidade

- Refatorei todo o processamento de mensagens em tempo real e corrigi travamentos internos (o famoso _borrow checker_ do Rust) que ocorriam nas trocas de status. O SAO está mais leve do que nunca.

---

_Para acompanhar as próximas novidades em tempo real, fique de olho aqui no canal!_
