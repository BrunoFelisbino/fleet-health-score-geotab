# Fleet Health Score

Fleet Health Score é um add-in para MyGeotab criado para ajudar equipes de suporte, implantação, operação e gestão de frotas a enxergar rapidamente quais veículos podem gerar problemas técnicos.

A ideia nasceu de uma dor comum em operações de telemetria: existem muitos dados disponíveis, mas nem sempre é simples identificar quais dispositivos estão com comunicação ruim, GPS instável, tensão fora do padrão ou comportamento que indique risco de falha em campo.

Este projeto não tenta substituir os relatórios da Geotab. O foco é outro. Ele organiza sinais técnicos do dispositivo em uma visão simples de saúde da frota, ajudando a priorizar análise e ação.

## O que o add-in faz

O Fleet Health Score calcula uma nota técnica para cada veículo analisado. Essa nota vai de 0 a 100 e representa a saúde do dispositivo e da instalação de telemetria.

A base ativa considera veículos com dados válidos nos últimos 30 dias. O score é calculado olhando principalmente para os últimos 7 dias.

O painel mostra a saúde geral da frota, os principais problemas encontrados, o ranking dos veículos mais críticos, um mapa técnico e os detalhes que explicam a perda de pontos em cada veículo.

## O que é analisado

O score considera sinais ligados à qualidade da telemetria, como comunicação recente, falhas de GPS, reinicializações do dispositivo, tensão fora do padrão e possíveis falhas críticas do equipamento.

Quando existe falha de tensão, o add-in também mostra as leituras encontradas. Isso ajuda a diferenciar uma queda leve de alimentação de um comportamento realmente crítico.

## Como interpretar o score

Quanto maior a nota, melhor a saúde técnica do veículo.

| Score | Leitura sugerida |
| ---: | --- |
| 90 a 100 | Excelente |
| 80 a 89 | Saudável |
| 70 a 79 | Atenção |
| 60 a 69 | Crítico |
| Abaixo de 60 | Grave |

Um veículo sem dados recentes recebe uma penalização mais forte, porque ausência de comunicação normalmente representa risco real para suporte, operação e cliente.

## Indicadores principais

### Fleet Health Index

Mostra a média geral de saúde da frota analisada. É o número principal para entender se a operação está estável ou se existe degradação técnica.

### Saúde da comunicação

Ajuda a identificar veículos que estão comunicando normalmente e veículos que deixaram de enviar dados no período esperado.

### Qualidade elétrica

Usa as leituras de tensão para indicar possíveis problemas de alimentação, bateria, alternador, aterramento ou instalação.

### Risco de instalação

Agrupa veículos que apresentam sinais comuns de instalação ou equipamento com comportamento suspeito, como reboot excessivo, falha de GPS, tensão irregular ou falha crítica do device.

### Sem dados nos últimos 7 dias

Destaca veículos que estiveram ativos na base recente, mas não enviaram dados válidos nos últimos 7 dias.

### Top problemas

Mostra quais problemas aparecem com mais frequência. Ao clicar em um problema, o painel filtra automaticamente o ranking, o mapa e os indicadores para aquela condição.

## Ranking técnico

O ranking organiza os veículos do pior para o melhor score. A intenção é ajudar o time técnico a responder rapidamente uma pergunta simples: por onde começar?

Ao selecionar um veículo, o painel lateral mostra os detalhes da análise, incluindo score, último dado, falhas de GPS, reboots, tensão mínima, tensão máxima, leituras ruins de tensão e motivos que explicam a perda de pontos.

## Mapa técnico

O mapa usa OpenStreetMap e mostra a última posição válida dos veículos analisados.

As cores dos marcadores seguem o nível de risco do score, facilitando a identificação visual dos veículos que merecem atenção.

## Público recomendado

Este add-in foi pensado para pessoas que vivem a rotina da telemetria no dia a dia, principalmente suporte técnico, implantação, pós-venda, monitoramento, operações de campo, analistas de dados e gestores de frota.

## Instalação no MyGeotab

Publique este repositório no GitHub Pages e use o conteúdo de `addin-config.json` na área de Add-Ins do MyGeotab.

A URL padrão do projeto é:

```text
https://brunofelisbino.github.io/fleet-health-score-geotab/
```

O nome registrado do add-in é:

```text
fleetHealthScore
```

No código, o add-in é registrado como:

```js
geotab.addin.fleetHealthScore
```

Esses nomes precisam permanecer iguais para o MyGeotab carregar o add-in corretamente.

## Status do projeto

Esta versão está em fase beta.

A proposta agora é validar o comportamento em bases reais, observar se os veículos críticos fazem sentido para quem acompanha a operação e ajustar o score com base no uso prático.

Sugestões, testes e feedbacks são bem-vindos.
