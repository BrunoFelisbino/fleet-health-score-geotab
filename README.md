# Fleet Health Score — Geotab Add-In

Add-in gratuito para MyGeotab que calcula um score técnico de saúde da frota, identificando veículos com risco operacional por ausência de dados, reboot excessivo, falhas de GPS, tensão fora do padrão e possíveis falhas do dispositivo.

## Objetivo

O Fleet Health Score foi criado para apoiar times de suporte, telemetria, implantação e gestão de frotas a encontrar rapidamente quais veículos precisam de atenção técnica.

A ideia é simples:

- considerar como base ativa veículos com dados válidos nos últimos 30 dias;
- calcular o score técnico com base nos últimos 7 dias;
- mostrar KPIs, ranking, mapa e motivos da perda de pontos.

## Score

Peso total: 100 pontos.

| Critério | Peso |
|---|---:|
| Comunicação recente | 30 |
| Reboot do dispositivo | 20 |
| GPS / posição válida | 15 |
| Tensão do dispositivo | 20 |
| Falhas críticas do device | 15 |

## Status

| Score | Status |
|---:|---|
| 80 a 100 | Saudável |
| 60 a 79 | Atenção |
| 40 a 59 | Crítico |
| 0 a 39 | Risco alto |

## Instalação no MyGeotab

1. Publique este repositório no GitHub Pages.
2. Acesse **Administration → System → Add-Ins**.
3. Adicione um novo add-in.
4. Cole o conteúdo de `addin-config.json`.

## URL padrão GitHub Pages

```text
https://brunofelisbino.github.io/fleet-health-score-geotab/
```

## Observação importante

O nome do add-in no JSON é:

```text
fleetHealthScore
```

E o código registra:

```js
geotab.addin.fleetHealthScore
```

Isso precisa bater exatamente para evitar tela de erro no MyGeotab.
