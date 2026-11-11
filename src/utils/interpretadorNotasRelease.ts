/**
 * Utilitário para interpretação e estruturação das Notas de Release do SAO no site de downloads.
 * Lê o arquivo NOTAS_RELEASE.md (escrito em linguagem simples e acessível).
 */

export type CategoriaIconeSecao =
  | "novo"
  | "melhoria"
  | "agenda"
  | "chat"
  | "seguranca"
  | "sistema"
  | "web"
  | "relatorio"
  | "midia"
  | "outro";

export interface ItemNotaRelease {
  titulo?: string;
  descricao: string;
}

export interface SecaoNotaRelease {
  titulo: string;
  categoriaIcone: CategoriaIconeSecao;
  itens: ItemNotaRelease[];
}

export interface NotaReleaseVersao {
  versao: string;
  data: string;
  resumoDestaque?: string;
  secoes: SecaoNotaRelease[];
}

/**
 * Remove acentuação e converte para minúsculas para buscas insensíveis a caracteres especiais.
 */
export function normalizarTermo(texto: string): string {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Identifica a categoria visual e ícone temático a partir do título da seção.
 */
export function identificarCategoriaIcone(tituloSecao: string): CategoriaIconeSecao {
  const norm = normalizarTermo(tituloSecao);

  if (norm.includes("novo") || norm.includes("novidade") || norm.includes("lancamento")) {
    return "novo";
  }
  if (norm.includes("agenda") || norm.includes("compromisso") || norm.includes("calendario")) {
    return "agenda";
  }
  if (norm.includes("chat") || norm.includes("comuchat") || norm.includes("conversa") || norm.includes("mensagem")) {
    return "chat";
  }
  if (
    norm.includes("seguranca") ||
    norm.includes("senha") ||
    norm.includes("cofre") ||
    norm.includes("licenca")
  ) {
    return "seguranca";
  }
  if (
    norm.includes("busca") ||
    norm.includes("camera") ||
    norm.includes("ctrl") ||
    norm.includes("video")
  ) {
    return "sistema";
  }
  if (
    norm.includes("web") ||
    norm.includes("sac") ||
    norm.includes("intranet") ||
    norm.includes("pabx") ||
    norm.includes("whatsapp")
  ) {
    return "web";
  }
  if (
    norm.includes("relatorio") ||
    norm.includes("indicador") ||
    norm.includes("bi") ||
    norm.includes("grafico") ||
    norm.includes("metrica")
  ) {
    return "relatorio";
  }
  if (
    norm.includes("midia") ||
    norm.includes("anexo") ||
    norm.includes("foto") ||
    norm.includes("audio") ||
    norm.includes("arquivo") ||
    norm.includes("gravacao")
  ) {
    return "midia";
  }
  if (
    norm.includes("melhoria") ||
    norm.includes("correcao") ||
    norm.includes("ajuste") ||
    norm.includes("conserto") ||
    norm.includes("estabilidade")
  ) {
    return "melhoria";
  }

  return "outro";
}

/**
 * Interpreta o conteúdo em Markdown bruto do NOTAS_RELEASE.md e devolve a lista de versões estruturadas.
 */
export function interpretarNotasRelease(conteudoMarkdown: string): NotaReleaseVersao[] {
  if (!conteudoMarkdown || typeof conteudoMarkdown !== "string") {
    return [];
  }

  // Remove comentários HTML: <!-- ... -->
  const conteudoLimpo = conteudoMarkdown.replace(/<!--[\s\S]*?-->/g, "");
  const linhas = conteudoLimpo.split(/\r?\n/);

  const versoes: NotaReleaseVersao[] = [];
  let versaoAtual: NotaReleaseVersao | null = null;
  let secaoAtual: SecaoNotaRelease | null = null;

  for (let i = 0; i < linhas.length; i++) {
    const linhaBruta = linhas[i];
    const linha = linhaBruta.trim();

    if (!linha || linha === "---") {
      continue;
    }

    // 1. Cabeçalho de Versão: ## [0.8.x] - Outubro de 2026, ## 🚀 [0.8.x] - 10-2026 ou ## 0.8.x
    const matchVersao = linha.match(/^##\s*(?:[^\w\s[]*\s*)?\[?(?:v|V)?([a-zA-Z0-9._x-]+)\]?(?:\s*-\s*(.+))?$/u);
    if (matchVersao) {
      const versaoId = matchVersao[1].trim();
      const dataVersao = matchVersao[2] ? matchVersao[2].trim() : "";

      versaoAtual = {
        versao: versaoId,
        data: dataVersao,
        secoes: [],
      };
      versoes.push(versaoAtual);
      secaoAtual = null;
      continue;
    }

    if (!versaoAtual) {
      continue;
    }

    // 2. Frase de Destaque da Versão entre aspas
    if (!versaoAtual.resumoDestaque && !secaoAtual) {
      const linhaLimpaDestaque = linha.replace(/^\*\*|\*\*$/g, "").trim();
      const temAspasNormais = linhaLimpaDestaque.startsWith('"') && linhaLimpaDestaque.endsWith('"');
      const temAspasCurvas =
        (linhaLimpaDestaque.startsWith('“') && linhaLimpaDestaque.endsWith('”')) ||
        (linhaLimpaDestaque.startsWith('”') && linhaLimpaDestaque.endsWith('”'));
      const temAspasSimples = linhaLimpaDestaque.startsWith("'") && linhaLimpaDestaque.endsWith("'");

      if ((temAspasNormais || temAspasCurvas || temAspasSimples) && linhaLimpaDestaque.length > 2) {
        versaoAtual.resumoDestaque = linhaLimpaDestaque.slice(1, -1).trim();
        continue;
      }
    }

    // 3. Cabeçalho de Seção: ### ✨ O que há de novo
    const matchSecao = linha.match(/^###\s+(.+)$/);
    if (matchSecao) {
      const tituloSecao = matchSecao[1].trim();
      secaoAtual = {
        titulo: tituloSecao,
        categoriaIcone: identificarCategoriaIcone(tituloSecao),
        itens: [],
      };
      versaoAtual.secoes.push(secaoAtual);
      continue;
    }

    // 4. Item da Seção: - **Título**: Descrição ou - Descrição
    const matchItem = linha.match(/^[-*]\s+(.*)$/);
    if (matchItem && secaoAtual) {
      const corpoItem = matchItem[1].trim();

      const matchNegrito = corpoItem.match(/^\*\*(.*?)\*\*(?::\s*|\s*-\s*|\s+)?(.*)$/);
      if (matchNegrito) {
        const tituloLimpo = matchNegrito[1].trim().replace(/[:\s-]+$/, "").trim();
        secaoAtual.itens.push({
          titulo: tituloLimpo,
          descricao: matchNegrito[2].trim(),
        });
      } else {
        secaoAtual.itens.push({
          descricao: corpoItem,
        });
      }
      continue;
    }

    // 5. Linha de continuação de item anterior (se houver)
    if (secaoAtual && secaoAtual.itens.length > 0 && !linha.startsWith("#")) {
      const ultimoItem = secaoAtual.itens[secaoAtual.itens.length - 1];
      ultimoItem.descricao = `${ultimoItem.descricao} ${linha}`.trim();
    }
  }

  return versoes;
}

