import { Dictionary } from './en';

// Typed against the English dictionary on purpose: a missing key fails the build
// instead of silently rendering an English string in a Portuguese page.
export const ptBR: Dictionary = {
  appName: 'Caliper',
  tagline: 'Core Web Vitals, lado a lado',
  navAudit: 'Auditar',
  navCompare: 'Comparar',
  navAbout: 'Limiares',
  skipToContent: 'Ir para o conteúdo',
  themeToggle: 'Trocar tema',
  languageLabel: 'Idioma',

  urlLabel: 'URL da página',
  urlPlaceholder: 'https://exemplo.com',
  urlInvalid: 'Informe a URL completa, com https://',
  runAudit: 'Auditar',
  running: 'Rodando',
  cancel: 'Cancelar',

  strategyMobile: 'Celular',
  strategyDesktop: 'Computador',
  performanceScore: 'Nota de performance',
  scoreAria: 'Performance em {strategy}: {score} de 100',
  labDataNote: 'Dados de laboratório, celular intermediário simulado em conexão 4G lenta.',

  metricLcp: 'Largest Contentful Paint',
  metricInp: 'Interaction to Next Paint',
  metricCls: 'Cumulative Layout Shift',
  metricFcp: 'First Contentful Paint',
  metricTbt: 'Total Blocking Time',
  metricSi: 'Speed Index',

  ratingGood: 'Bom',
  ratingNeedsImprovement: 'Precisa melhorar',
  ratingPoor: 'Ruim',

  recentRuns: 'Últimas execuções',
  recentEmptyTitle: 'Nenhuma auditoria ainda',
  recentEmptyBody: 'Rode uma e as últimas cinco ficam aqui, só neste navegador.',
  clearHistory: 'Limpar histórico',
  auditFinished: 'Auditoria concluída para {url}',

  compareTitle: 'Comparar páginas',
  compareIntro:
    'Adicione de duas a quatro URLs. Elas rodam uma por vez, porque a API do PageSpeed recusa rajadas.',
  compareAddUrl: 'Adicionar URL',
  compareRemoveUrl: 'Remover URL',
  compareRun: 'Rodar comparação',
  compareBaseline: 'Referência',
  compareQueued: 'Na fila',
  compareDelta: 'Diferença vs. referência',
  compareEmptyTitle: 'Nada comparado ainda',
  compareEmptyBody: 'A primeira URL vira a referência, as outras são medidas contra ela.',
  compareProgress: 'Auditando {done} de {total}',

  aboutTitle: 'O que os números significam',
  aboutIntro:
    'Todos os limiares abaixo vêm das definições de Core Web Vitals publicadas pelo Google. O Caliper não inventa faixa própria.',
  aboutThresholds: 'Limiares',
  aboutLabVsField: 'Dado de laboratório e dado de campo',
  aboutColumnMetric: 'Métrica',
  aboutColumnGood: 'Bom',
  aboutColumnPoor: 'Ruim',
  aboutLcpBody:
    'Largest Contentful Paint é o instante em que o maior elemento da viewport termina de pintar. Ele mede carregamento percebido, então uma primeira pintura rápida com imagem principal lenta continua indo mal.',
  aboutInpBody:
    'Interaction to Next Paint mede o atraso entre uma interação e o próximo quadro. O Lighthouse não simula clique real, então essa métrica só aparece quando a página tem tráfego suficiente no Chrome UX Report.',
  aboutClsBody:
    'Cumulative Layout Shift soma o movimento inesperado de elementos visíveis. Anúncios, fontes que chegam tarde e imagens sem dimensão são as causas de sempre.',
  aboutLabBody:
    'Dado de laboratório vem de uma execução do Lighthouse em celular intermediário simulado. É repetível e serve para comparar duas versões, e nunca enxerga os seus usuários reais.',
  aboutFieldBody:
    'Dado de campo vem do Chrome UX Report, agregado em 28 dias de visitas reais. É o que a Busca usa, e só existe para páginas com tráfego suficiente.',

  settingsTitle: 'Chave de API',
  settingsBody:
    'A API do PageSpeed funciona sem chave em volume baixo. Cadastre a sua se bater no limite de cota. Ela fica só neste navegador.',
  settingsSave: 'Salvar chave',
  settingsClear: 'Remover chave',
  settingsSaved: 'Chave salva neste navegador',

  errorNetwork: 'A requisição não chegou na API. Verifique a conexão.',
  errorRateLimited: 'A API está limitando este navegador. Espere um minuto e tente de novo.',
  errorNotAudited: 'A API não conseguiu carregar essa página. Ela pode estar fora do ar ou bloqueando robôs.',
  errorServer: 'A API falhou do lado dela. Tentar de novo costuma resolver.',
  errorUnknown: 'Algo falhou ao auditar essa URL.',
  retry: 'Tentar de novo',
};
