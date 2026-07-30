# Caliper no LinkedIn

Texto pronto para a seção Projetos, no mesmo formato dos outros repositórios.

## Título

Caliper - Auditoria de Core Web Vitals (Open Source)

## Período

jul de 2026 - jul de 2026

## Descrição

Aplicação Angular que consome a API do PageSpeed Insights e compara Core Web Vitals de várias páginas lado a lado. O problema aqui é coordenação, não renderização: duas auditorias em paralelo, uma fila serial, cancelamento e retry.

- Angular 21 standalone e zoneless: três rotas lazy, todo componente OnPush, injeção por inject(), nenhum NgModule e nenhum any.
- Quatro operadores de RxJS, cada um com um motivo defensável: debounceTime com distinctUntilChanged no campo de URL, switchMap na busca para cancelar a auditoria abandonada, forkJoin para rodar celular e computador em paralelo e concatMap na fila do comparador, porque a API responde rajada com 429.
- Retry com backoff que só dispara em falha de rede e 5xx, e um AuditError tipado: HttpErrorResponse nunca chega na camada de interface.
- 48 testes rodando em dois runners, Vitest e Karma com Jasmine, com 94% de cobertura de statements. Um helper fino resolve as diferenças de API entre os dois em vez de duplicar as specs.
- Um dos testes de componente achou um bug real antes da publicação: o formulário usava ngSubmit sem NgForm no template, então o submit não fazia nada.
- Lighthouse no build de produção: 95 de performance, 100 de acessibilidade e 100 de SEO no desktop. No mobile a performance fica em 64, e o README explica o porquê: o Angular Material no shell responde por 130 KB transferidos no bundle inicial.
- Internacionalização sem biblioteca, em cerca de 60 linhas: o dicionário em português é tipado contra o inglês, então uma chave faltando quebra o build em vez de renderizar texto errado.
- Quatro componentes SVG escritos à mão, com rótulo acessível no medidor de nota. Uma biblioteca de gráfico custaria dezenas de kilobytes para desenhar três formas simples.

Stack: Angular 21, TypeScript strict com strictTemplates, RxJS, Angular Material e CDK, SCSS com custom properties, Vitest, Karma com Jasmine, ESLint, GitHub Actions e Cloudflare Workers.

Demo: https://caliper.filipespan.workers.dev
Código: https://github.com/Filipespan/caliper

## Competências para marcar

Angular, RxJS, TypeScript, Testes unitários, Acessibilidade web, Core Web Vitals, SCSS, Integração contínua, Cloudflare Workers.

## Mídia para anexar

- GitHub - Filipespan/caliper: https://github.com/Filipespan/caliper
- Demo publicada: https://caliper.filipespan.workers.dev
- Página de limiares (o que cada métrica significa): https://caliper.filipespan.workers.dev/about
- Decisões de RxJS no README: https://github.com/Filipespan/caliper#rxjs-decisions

O screenshot que está no README hoje mostra a tela vazia, porque a cota anônima da API do PageSpeed
recusou as chamadas deste IP enquanto o projeto era escrito. Antes de anexar imagem, vale rodar uma
auditoria com chave própria e trocar o arquivo (issue #2 do repositório).
