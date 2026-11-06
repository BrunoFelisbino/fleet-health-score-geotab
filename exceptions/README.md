# Fleet Exception 360

Add-in para MyGeotab focado em exceções/regras de telemetria. O objetivo é mostrar rapidamente onde a frota está violando regras: velocidade, uso indevido, condução agressiva, paradas, regras personalizadas e demais exceções configuradas no banco.

Não substitui os relatórios da Geotab. Organiza os sinais de exceção em uma visão simples para operação, campo, suporte e gestão.

## O que o add-in faz

O Fleet Exception 360 calcula uma visão por período para a base ativa:

- total de eventos de exceção;
- instâncias de exceção (quando disponível em `exceptionCount`);
- veículos envolvidos;
- regras distintas;
- exceções nas últimas 24 horas;
- ranking dos veículos mais ofensores;
- top regras;
- lista detalhada de eventos;
- exportar CSV dos dados filtrados.

## Fontes de dados

- `Device`: veículos ativos (`activeFrom`/`activeTo`, sem arquivados)
- `Group`: hierarquia de grupos/filtros
- `Rule`: nome das regras/exceções
- `Driver`: nome do condutor (quando disponível e permitido)
- `ExceptionEvent`: eventos de exceção por período

Eventos de veículos fora da base ativa/arquivados são ignorados.

## Instalação

Publique este repositório no GitHub Pages e adicione `addin-config.json` no MyGeotab:

https://brunofelisbino.github.io/fleet-exception-360/

O nome interno é:

fleetException360

O add-in é registrado como:

geotab.addin.fleetException360

## Uso

1. Abra o menu lateral em MyGeotab > Fleet Exception 360.
2. Escolha o período (7, 14, 30 ou 90 dias).
3. Filtre por grupo, regra, veículo/placa ou nome.
4. Veja KPIs, ranking, top regras e a lista.
5. Use Exportar CSV para suporte/campo.

## Status

MVP: dashboard de exceções/regras de telemetria. Próximos passos possíveis: severidade por regra, comparativo semana sobre semana, mapa de eventos e relatório PDF.
