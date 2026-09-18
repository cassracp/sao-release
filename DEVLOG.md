# 🛠️ DevLog - SAO (Sistema de Auxílio Operacional)

Este documento registra as principais atualizações, melhorias e correções feitas no projeto. O formato ideal para cada entrada é misturar uma linguagem amigável (excelente para a comunidade no Discord) com a organização técnica que os desenvolvedores amam no GitHub.

---

## 🚀 [0.7.1] - 09-2026

**"Correções no Fluxo de Edição de Agendamentos e Gestão de Horários Livres!"**

### 🐛 Correções Críticas na Agenda

- **Correção na Edição de Agendamentos (Abertura Atômica via Zustand)**:
  - Corrigida falha em que tentar editar qualquer compromisso ou bloco da Agenda abria invariavelmente o formulário de "Novo Agendamento" (sem carregar o ID existente), impedindo a alteração e gerando agendamentos duplicados por cima dos horários existentes.
  - Abertura e fechamento do modal unificados de forma atômica e direta através da store Zustand (`useAgendaStore`), eliminando qualquer captura de estado desatualizado (*closure stale*).

### 📅 Saneamento e Ciclo de Vida de "Agenda Livre"

- **Ações Adequadas para Horários Disponíveis**:
  - Removido o botão indevido de "Cancelar" dos blocos de Agenda Livre (evitando registros espúrios de cancelamento de cliente no BI e loops de geração de novos blocos).
  - Disponibilizado o botão **"Excluir"** no popover e no menu de contexto para blocos livres, permitindo remover o horário vago com diálogo de confirmação claro.
- **Conversão Fluida de Disponibilidade**:
  - Ao editar um bloco de Agenda Livre e associar um cliente ou alterar o título, o horário disponível é convertido automaticamente em um agendamento regular e o mesmo registro é atualizado no banco de dados via ID, sem exigir diálogos de confirmação redundantes.
- **Persistência de Horários Livres Pós-Cancelamento no Backend Rust**:
  - Corrigida a persistência em `cancelar_agendamento` para gravar `is_bloqueio_disponibilidade: true` nos blocos de Agenda Livre gerados, garantindo consistência nas checagens de conflito e autorização adequada para colaboradores com permissão de edição/criação/agendamento.

---

## 🚀 [0.7.0] - 09-2026

**"Inteligência Analítica com Painel BI de Cancelamentos e Governança na Agenda!"**

### 📊 Painel de BI e Métricas de Cancelamentos

- **Métricas e Indicadores em Tempo Real**: Novo painel analítico para acompanhamento detalhado dos cancelamentos de agendamentos. Acompanhe taxas de cancelamento, motivos mais frequentes, distribuição por solicitante (Cliente vs. DeMaria) e volume por agenda.
- **Filtros e Análise Histórica**: Filtre os cancelamentos por período e agenda, visualizando o histórico completo com data, horário, responsável, motivo, solicitante, justificativa e indicação de reagendamento.
- **Gestão de Motivos Customizados**: Gestores de agendas agora possuem uma aba exclusiva chamada **"Motivos de Cancelamento"** nas configurações da agenda, permitindo cadastrar, editar e desativar motivos específicos para a realidade da sua equipe.
- **Filtro Rápido "Ocultar Cancelados"**: Adicionado botão de alternância na barra superior da agenda para ocultar ou exibir agendamentos cancelados, mantendo o calendário limpo no dia a dia sem perder o histórico analítico.

### 🛡️ Governança de Acesso e Permissões Granulares

- **Acesso Nativo por Hierarquia de Cargo**: Usuários em cargos iguais ou superiores a **Gerente** (Gerente, Gerente Geral, Diretoria e Administrador) têm acesso imediato e nativo ao Painel BI e suas métricas.
- **Permissão Granular por Agenda (`view_bi`)**: Gestores de agenda podem delegar acesso analítico a colaboradores específicos da equipe através de uma nova permissão chamada **"Visualizar BI e Métricas"** na aba de membros das configurações da agenda.

### 🎯 Saneamento das Ações do Agendamento (Popover)

- **Separação Clara entre "Cancelar" e "Excluir"**: Diferenciação definitiva das ações no popover do agendamento:
  - **Cancelar** (ícone âmbar): abre o modal para registro formal do motivo, solicitante e justificativa, alimentando os dados do BI.
  - **Excluir** (ícone vermelho): realiza a remoção permanente do agendamento com diálogo de confirmação.
  - **Reativar** (ícone verde): permite restaurar rapidamente um compromisso previamente cancelado.
  - **Editar** (ícone lápis): abre o formulário completo para edição de dados do compromisso.
- **Correção de Duplicidades**: Eliminados botões duplicados de cancelamento que apareciam sob determinadas condições no popover de clique simples do agendamento.

### 🔄 Sincronização em Tempo Real e Navegação Fluida da Agenda

- **Preservação de Contexto e Detalhes Abertos**: Acabou o incômodo de perder o que estava fazendo ao clicar em links de Tarefas da Intranet ou Ordens de Serviço do SAC dentro de um agendamento! As abas agora contam com preservação de estado (*keep-alive*): ao navegar para a Intranet ou SAC e depois retornar para a Agenda, o modal de detalhes do agendamento continua aberto no exato lugar onde estava.
- **Resultados de Pesquisa Persistentes**: A lista de resultados da Pesquisa Avançada agora permanece intacta mesmo após clicar em um agendamento para inspecioná-lo ou alternar entre módulos. Chega de ter que pesquisar tudo de novo ao voltar!
- **Sincronização Silenciosa em Background**: As atualizações em tempo real entre diferentes usuários (`NOTIFY realtime_events` e eventos Tauri) agora recarregam os dados da Agenda silenciosamente em segundo plano, sem fechar modais, desmarcar seleções ou atrapalhar a digitação do usuário.
- **Isolamento de WebViews Nativas (Intranet e SAC)**: Criado controle inteligente no backend Rust (`hide_all_embedded_webviews`) e frontend para sincronizar a visibilidade de janelas nativas Webview2 do Windows. Ao retornar à Agenda ou outros módulos React, as WebViews filhas são ocultadas imediatamente pelo sistema operacional, impedindo qualquer sobreposição indevida na tela e reaparecendo instantaneamente quando a aba do módulo for reativada.

### 🏗️ Melhorias de Arquitetura e Engenharia

- **Store Global da Agenda (`useAgendaStore`)**: Criação de store reativa com Zustand para centralizar a persistência de modais, data de visão e resultados de pesquisa, desacoplando o ciclo de vida do componente visual dos dados em memória.
- **Centralização DRY de Permissões**: Refatorada a deserialização de permissões em Rust (`PermissoesJson::resolver`), substituindo dezenas de blocos repetitivos e garantindo robustez a cada novo atributo de autorização adicionado.

---

## 🚀 [0.6.9] - 09-2026

**"Pesquisa mais inteligente na Agenda e suporte completo a clientes CLC!"**

### 🔍 Busca Avançada por Clientes na Agenda

- **Campo Dedicado de Cliente CLC**: Adicionamos um campo específico de busca de clientes na pesquisa de agendamentos, com autocomplete idêntico ao formulário de criação/edição. Agora é possível buscar tanto selecionando da lista (pelo código ou nome) quanto digitando termos livres.
- **Busca de Clientes na Pesquisa Rápida ("O quê")**: Sabe aquele agendamento com título genérico como "Treinamento" ou "Migração"? Agora, ao digitar o nome ou código do cliente no campo de palavras-chave ("O quê" ou "Pesquisa rápida"), o sistema localiza o compromisso automaticamente através do vínculo com o cliente CLC!
- **Filtro Independente de Vínculo**: O checkbox foi mantido de forma separada como **"Apenas com cliente associado"**, permitindo filtrar agendamentos que possuam qualquer cliente associado, combinado ou não com outros filtros.
- **Cliente Visível no Preview**: O card de resultados da pesquisa agora exibe uma linha dedicada ao **Cliente** associado (com ícone e formato `código - nome`), facilitando a identificação imediata do compromisso antes mesmo de abri-lo.

### 📝 Renderização de HTML nos Detalhes do Agendamento

- **Links e Formatações Clicáveis**: Corrigimos o preview de resultados da pesquisa da Agenda para renderizar tags HTML nativamente nos detalhes do evento. Links de tarefas e formatações ricas agora funcionam diretamente no card, eliminando a exibição de tags brutas de código.

### 🐛 Correções de Estabilidade

- **Tooltip de Links nos Detalhes do Agendamento**: Corrigi a visualização do aviso de atalho/clique nos links dentro do mini editor de texto rico. O tooltip agora flutua via portal com prioridade máxima de camada (`z-[99999]`), evitando que fique cortado ou oculto atrás da barra de ferramentas de formatação.
- **Unificação da Abertura de Links (SAC, Intranet e Externos)**: Unifiquei o comportamento de navegação em todo o sistema. Links de ordens de serviço do SAC (`https://www.sacdemaria.com.br/adm/...`) e de tarefas da Intranet (`https://www.demaria.com.br/intranet/v3/...`) agora abrem diretamente nos respectivos módulos internos do SAO tanto no ComuChat e Comentários da Agenda quanto nos editores de texto rico (MiniRichTextEditor e RichTextEditor) e visualizações da Agenda (popover e busca), reservando o navegador externo apenas para links de outros domínios.

---

## 🚀 [0.6.8] - 09-2026

**"Agendamentos mais rápidos e uma visão semanal muito mais limpa!"**

### 💡 Sugestões de Títulos Padrão na Agenda

- **Agilidade na Digitação**: Chega de digitar o mesmo título várias vezes! Agora, ao criar um agendamento, o sistema exibe automaticamente uma lista de sugestões de títulos conforme você digita, baseada na agenda selecionada.
- **Gestão de Títulos**: Se você tem permissão para gerenciar a agenda, agora conta com uma nova aba exclusiva chamada **"Títulos Padrão"** nas configurações. Lá, você pode cadastrar, editar e excluir facilmente os títulos que mais usa no seu setor.
- **Sincronização Mágica**: Adicionou um título novo? Ele já aparece para toda a sua equipe na mesma hora, sem precisar recarregar a tela!

### 📅 Mais Espaço na Sua Semana (Ocultar Finais de Semana)

- **Foco nos Dias Úteis**: Atendendo a pedidos, adicionamos a opção de **"Ocultar Finais de Semana"** nas configurações da agenda.
- **Fim do Aperto**: Ao ativar essa opção, a visão semanal esconde o sábado e o domingo, esticando as colunas de segunda a sexta. Isso dá um belo respiro na tela, deixando os agendamentos mais largos, fáceis de ler e com um visual muito mais agradável, principalmente naqueles dias super lotados!

### 🐛 Correções

- **Estabilidade e Ajustes**: Apliquei também um pacote de correções internas e ajustes finos baseados em feedbacks fornecidos no Discord.

---

## 🚀 [0.6.7] - 09-2026

### 💬 Contraste nos Comentários da Agenda

- Ajustei os balões do chat de agendamentos para usar tons de grafite no modo escuro, preservando a diferenciação visual entre mensagens próprias e de outros usuários.
- Corrigi a herança de cores do conteúdo formatado para manter o texto legível dentro dos balões.

### 📅 Recorrência de Agendamentos

- Adicionei a opção **Repetir agendamento** ao fluxo de agendamento único, mantendo o Lote de Agendamento para registros independentes.
- A criação recorrente grava uma série e suas ocorrências em uma transação, com suporte a recorrência diária, semanal, quinzenal e mensal.
- A série permite definir intervalo, quantidade de ocorrências ou data final, com validação de permissão e limite de segurança no backend.

## 🚀 [0.6.6] - 09-2026

### Correção de Bug no Controle de Scripts SQL

Foi identificado um pequeno bug no arquivo `.bat` que executava todos o arquivo de script `.sql` unificado gerado pelo módulo de **Controle de Scripts SQL**.

A correção foi aplicado na build `0.6.6`

## 🚀 [0.6.5] - 09-2026

**"Evolução: De Unificador de Scripts para Controle de Scripts SQL"**

### 🗄️ Renomeação e Refatoração: Controle de Scripts SQL

O antigo módulo **Unificador de Scripts** amadureceu e agora se chama oficialmente **Controle de Scripts SQL**! A nova nomenclatura reflete a transformação da ferramenta em um verdadeiro hub para gestão, empacotamento e deploy de atualizações em bancos de dados.

- **Execução Direta no Banco (Nativa e sem Modais)**:
  - Adicionada a aba **"Executar no Banco de Dados"** diretamente no módulo, dispensando janelas modais flutuantes e mantendo navegação fluida por abas.
  - Varredura e detecção automática de instâncias locais ativas do PostgreSQL (portas 5432 a 5438).
  - Seletor inteligente de bancos de dados locais com opção de digitação manual livre.
  - Indicadores em tempo real da versão do PostgreSQL e da versão do sistema DOC-Windows (tabela `aux_preferencias_tb.inf_bd_rel`), com atualização automática ao concluir os scripts e botão interativo para refresh.
  - Suporte completo a modos de transação: *Única (Tudo ou Nada)*, *Por Script* ou *Sem Transação*, além de parada no primeiro erro e decodificação automática de encodings (UTF-8, Windows-1252, ASCII, UTF-8 BOM).
- **Fila de Execução com Paridade Visual e Funcional**:
  - Grid adaptativo com proporção otimizada (5 colunas para a Fila de Scripts e 7 colunas para o Terminal de Logs).
  - Barra de ferramentas idêntica à lista principal: campo de busca textual e opção destacada de **pesquisar dentro do conteúdo dos arquivos** (tanto em pastas locais quanto no cache do GitHub).
  - Pílulas de filtro (*Todos* / *Selecionados*), ordenação cronológica (*V. Mais Antiga* / *V. Mais Recente*) e ações em lote (*Selecionar Todos* / *Desmarcar Todos*).
  - Botão de ação rápida para **copiar a seleção da aba Unificar** diretamente para a fila de execução.
- **Terminal de Logs Amplo em Tempo Real**:
  - Acompanhamento do progresso script a script com tempo de execução em milissegundos.
  - Realce sintático de SQL, filtros por nível de log (*Sucesso*, *Aviso*, *Erro*), busca no histórico, cópia e download da saída em `.txt`.
- **Refatoração Arquitetural e Limpeza de Código**:
  - Código, componentes e diretórios refatorados para `ControleScriptsSqlModule` e `src/components/controle-scripts-sql/`.
  - Retrocompatibilidade total preservada nas permissões de usuário e chaves de armazenamento local (`localStorage`).
  - Cache de sincronização com o GitHub otimizado para pular instantaneamente scripts inalterados sem queries ou downloads repetidos.

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
- **Visual Responsivo**: Toda a interface do Cofre de Senhas já está adaptada para o novo padrão de *Cores Dinâmicas*, acompanhando nativamente a identidade visual do módulo sem engessar a UI.

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
- **Pensando no Futuro**: A ligação robusta que criamos através da coluna `cod_clc` no banco de dados PostgreSQL é o primeiro passo para no futuro permitir visualizar *todo* o histórico e formulários atrelados a um único cliente num piscar de olhos.

### 🎯 Refinamentos Visuais e Funcionais na Agenda

- **Escala de Tempo Ampliada**: Aumentamos o espaçamento vertical das visões de Dia e Semana, garantindo que textos e badges caibam sem sufoco nas linhas. Além disso, a visão inicial do calendário agora tem seu "scroll" padrão posicionado nas **08:00h**, facilitando a navegação diária.
- **Melhoria Absurda na Visão Mensal**:
  - Acabamos com os *popups* quebrados padrão do calendário quando muitos eventos tentam disputar o mesmo dia! Agora um botão discreto **"Mais X"** aparece no rodapé do dia. Ao clicar, um **Modal Dialog** focado e elegante é aberto listando todos os eventos extras.
  - Eventos na visão mensal agora exibem nativamente as badges dos participantes para bater o olho e saber quem está envolvido, com um limite de até **3 badges**. Caso a equipe seja maior, um botão inteligente de reticências (`...`) exibe o resto da turma ao passar o mouse (*tooltip list*).
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

- **Salvamento Automático Robusto**: Agora o Editor de Texto salva seus documentos diretamente no banco de dados, além de manter uma cópia rápida no navegador (*Local Storage*).
  - **O ganho prático:** Se você mudar de computador, limpar o cache do navegador ou formatar o PC, **seus textos não serão mais perdidos**, pois estarão sincronizados com a nuvem! (Lembrando que os textos não bloqueados ficam salvos no banco por 90 dias).
- **Privacidade Garantida**: Para a sua tranquilidade, todos esses dados salvos no banco são rigorosamente criptografados, garantindo a total privacidade dos textos de cada usuário.
- **Imagens Otimizadas**: Fiz uma otimização profunda no tratamento das imagens auto-hospedadas dentro do Editor de Texto, melhorando significativamente a qualidade visual e o comportamento do visualizador de imagens embutido.

### 💬 ComuChat: Agora é Oficialmente um Monstro

- **Novo Editor de Texto (Tiptap)**: O chat recebeu um upgrade absurdo. Agora há suporte para emojis nativos, blocos de código formatados e links customizados!
- **Sistema de Menções Completo**: Agora você pode digitar `@` e mencionar não apenas **Usuários**, mas também **Setores** e **Cargos**. Falar com a pessoa certa nunca foi tão fácil.
- **Mensagens Fixadas**: Informação importante no canal? Agora você pode fixar (*pin*) mensagens para que ninguém perca os avisos cruciais.
- **Gestão de Comunidades**: Adicionei painéis completos para administração de membros, atribuição de cargos e até exclusão de comunidades, dando total controle aos administradores.

### 🔔 Notificações e Agenda: O Poder é Seu

- **Granularidade Máxima no ComuChat**: Nas Configurações, você agora decide exatamente o que aciona um alerta (Todas as mensagens, Menções, Cargos ou DMs) *separadamente* para os seus status (Disponível, Ocupado ou Ausente). Escolha se quer som, pop-up ou apenas silêncio.
- **Integração de Agenda com WhatsApp**: Implementei um sistema robusto de gestão de agendas que agora conta com configurações para disparar notificações automáticas via WhatsApp.
- **Sons Elegantes para Status Temporários**: Colocou o status em "Almoço" por 60 minutos? O sistema te avisará com um suave efeito sonoro de piano assim que o timer expirar.

### ⚡ Infraestrutura e Qualidade de Vida (QoL)

- **Atualizações Silenciosas via GitHub**: Diga adeus ao antigo servidor IIS! Migrei todo o sistema de entrega de atualizações para o *GitHub Releases*. O SAO agora baixa atualizações silenciosamente no fundo e os instaladores lidam automaticamente com os certificados.
- **Nova Arquitetura Core (Tauri v2)**: Reconstruí a base do aplicativo para suportar múltiplas abas (multi-tab layout) e uma navegação muito mais rápida e fluida.
- **Visualizador Unificado de Scripts SQL**: Para otimizar a parte técnica, criei um novo componente dedicado à visualização unificada de scripts do banco.

### 🐛 Correções de Estabilidade

- Refatorei todo o processamento de mensagens em tempo real e corrigi travamentos internos (o famoso *borrow checker* do Rust) que ocorriam nas trocas de status. O SAO está mais leve do que nunca.

---

*Para acompanhar as próximas novidades em tempo real, fique de olho aqui no canal!*
