# Fleet Exception 360

Módulo Fleet Exception 360, dentro do add-in Fleet Health Score. Foca em exceções/regras de telemetria usando `ExceptionEvent` + `Device`, com visual alinhado ao dashboard principal.

## Menu adicional no Add-In

| Menu | URL | Função |
| --- | --- | --- |
| Fleet Exception 360 | `/exceptions/` | Dashboard de exceções/regras de telemetria. |

## Fontes de dados

- `Device`: veículos ativos (`activeFrom`/`activeTo`, sem arquivados)
- `Group`: hierarquia de grupos/filtros
- `Rule`: nome das regras/exceções
- `Driver`: nome do condutor (quando disponível e permitido)
- `ExceptionEvent`: eventos de exceção por período

Eventos de veículos fora da base ativa/arquivados são ignorados.

## Registro no MyGeotab

A página registra o mesmo namespace do add-in principal:

fleetHealthScore

O add-in é registrado como:

geotab.addin.fleetHealthScore

## Uso

1. Abra em MyGeotab > Fleet Exception 360.
2. Escolha o período (7, 14, 30 ou 90 dias). Padrão: 7 dias.
3. Filtre por grupo, regra, veículo/placa/nome.
4. Veja KPIs, ranking, top regras e a lista.
5. Use Exportar CSV para suporte/campo.

## Status

MVP dashboard de exceções/regras. Próximos passos: severidade por regra, comparativo semana a semana e opcional relatório PDF.
