# infographicsSVG

Biblioteca JavaScript leve para criar infográficos SVG a partir de dados percentuais. Os gráficos são declarados diretamente no HTML via atributos `data-*`, sem necessidade de chamadas JavaScript.

Veja os exemplos ao vivo em: **[luizcruz.github.io/infographicsSVG/graph.html](https://luizcruz.github.io/infographicsSVG/graph.html)**

---

## Instalação

Inclua o script na página. Nenhuma dependência externa.

```html
<script src="lib/infographicSVG.js"></script>
```

---

## Uso declarativo (recomendado)

Adicione o atributo `data-infographic` a qualquer `<div>` e configure os demais atributos. A biblioteca inicializa todos os elementos automaticamente ao carregar a página.

```html
<div data-infographic
     data-items="40"
     data-per-column="10"
     data-type="humans"
     data-segments="63,red;33,blue">
</div>
```

### Atributos

| Atributo | Obrigatório | Descrição |
|---|---|---|
| `data-infographic` | ✅ | Marca o elemento para ser inicializado |
| `data-items` | ✅ | Total de ícones a renderizar (1–500) |
| `data-per-column` | ✅ | Quantidade de ícones por coluna |
| `data-type` | ✅ | Tipo de forma — ver tabela abaixo |
| `data-segments` | ✅ | Distribuição de cores — ver formato abaixo |

### Formato de `data-segments`

```
"porcentagem,cor;porcentagem,cor;..."
```

- **Porcentagem**: número inteiro de 0 a 100
- **Cor**: código hexadecimal (`#rgb` ou `#rrggbb`) ou nome CSS alfabético (`red`, `gold`, `black`…)
- Os segmentos são separados por `;` e a porcentagem da cor por `,`

```html
<!-- Três segmentos -->
data-segments="45,#e74c3c;30,#f1c40f;25,#27ae60"
```

> **Nota:** as porcentagens não precisam somar exatamente 100%. Itens excedentes recebem a cor do último segmento.

---

## Tipos de forma (`data-type`)

### `humans` — Pictograma humano

Ideal para representar populações ou grupos de pessoas.

```html
<div data-infographic
     data-items="40"
     data-per-column="10"
     data-type="humans"
     data-segments="63,red;33,blue">
</div>
```

### `box` — Quadrado

Indicado para comparações simples entre categorias.

```html
<div data-infographic
     data-items="40"
     data-per-column="10"
     data-type="box"
     data-segments="45,red;55,black">
</div>
```

### `circle` — Círculo

Boa escolha para dados com três ou mais categorias.

```html
<div data-infographic
     data-items="40"
     data-per-column="10"
     data-type="circle"
     data-segments="38,red;25,blue;33,darkgray">
</div>
```

### `soccer` — Bola de futebol ⚽

Círculo colorido com patch pentagonal e linhas de costura, ideal para dados esportivos.

```html
<div data-infographic
     data-items="48"
     data-per-column="12"
     data-type="soccer"
     data-segments="40,#27ae60;25,#f1c40f;35,#e74c3c">
</div>
```

### `trophy` — Taça de campeão 🏆

Silhueta de troféu com alças, haste e base. Cada ícone representa uma conquista ou título.

```html
<div data-infographic
     data-items="18"
     data-per-column="5"
     data-type="trophy"
     data-segments="26,#009c3b;22,#333333;22,#0066cc;16,#74acdf;14,#0055a4">
</div>
```

---

## API programática (retrocompatível)

A função `doGraph()` continua disponível para uso direto em JavaScript.

```javascript
doGraph(totalItens, itensPorColuna, [[porcentagem, cor], ...], tipo, idDoElemento);
```

```html
<div id="meu-grafico"></div>

<script>
  doGraph(40, 10, [[63, 'red'], [33, 'blue']], 'humans', 'meu-grafico');
</script>
```

> As mesmas validações de segurança se aplicam: cores são validadas por whitelist e o total de itens é limitado a 500.

---

## Segurança

- **Sem `innerHTML`**: o SVG é construído via `createElementNS` / `setAttribute` — sem risco de XSS
- **Whitelist de cores**: apenas hex (`#rgb`, `#rrggbb`) ou nomes alfabéticos CSS são aceitos
- **Validação de entrada**: todos os atributos são validados antes do uso; configurações inválidas exibem `[infographic: invalid configuration]`
- **Limite de itens**: máximo de 500 ícones por infográfico para evitar travamento do browser

---

## Testes

### Biblioteca principal

```bash
npm install
npm test
```

Testes em `tests/infographicSVG.test.js` cobrem validação de entradas, whitelist de cores, todos os tipos de forma, dimensões do SVG e invariantes de segurança.

### Bloco Gutenberg

```bash
cd wordpress-plugin/infographic-svg-block
npm install
npm test
```

Testes em `src/__tests__/` cobrem `parseSegments`, `serializeSegments` e o componente `save()`.

### Pipeline

Os testes rodam automaticamente no GitHub Actions em todo push e pull request. O deploy para o GitHub Pages só ocorre se todos os testes passarem.

---

## Exemplos completos

Veja [`graph.html`](graph.html) para exemplos funcionais de todos os tipos, incluindo:

- Eleição presidencial dos EUA (humans)
- Participação eleitoral (box)
- Equilíbrio partidário (circle)
- Resultados da Copa do Mundo FIFA 2022 — fase de grupos (soccer)
- Top 5 seleções com mais títulos na Copa do Mundo FIFA (trophy)
