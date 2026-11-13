# Fleet Exception 360

Módulo de análise de regras e eventos de exceção do [Fleet Health Score](../README.md), disponibilizado como a segunda página do Add-in no MyGeotab.

## Dados e funcionalidades

A página utiliza `Device` (veículos ativos), `Group` (grupos), `Rule` (regras), `ExceptionEvent` (eventos) e informações de motorista quando disponíveis e autorizadas. Eventos fora da seleção de ativos não são apresentados no painel.

- **Menu:** Fleet Exception 360 (URL pública `/exceptions/`).
- **Períodos disponíveis:** **Hoje (24h)**, 7, 14, 30 e 90 dias, além de **Personalizado** com data e hora de início e fim. **Padrão atual: Hoje (24h)**.
- **Filtros:** grupo, regra, texto da regra, veículo/placa/nome e intervalo personalizado de data/hora.
- **Visões:** indicadores, distribuição, ranking por instâncias, duração acumulada, mapa e auditoria por veículo.
- **Exportação:** CSV; PDF **Resumo** (quatro páginas) ou **Auditoria detalhada** (resumo e páginas adicionais por veículo). O PDF executivo prioriza eventos, regras, duração e estado, sem colunas de cobertura, instâncias ou identificadores internos.
- **PDF com logo opcional:** ao baixar, escolha incluir um SVG, PNG, JPG ou WebP. O logo entra no cabeçalho, na capa e nos rodapés apenas daquele PDF, sem persistência.

A página registra `geotab.addin.fleetHealthScore`, o mesmo namespace do painel principal. Os dados são consultados pela sessão autorizada no MyGeotab, sem conteúdo demonstrativo fictício.

As contagens baseadas em `ExceptionEvent` são rotuladas como mínimo observado quando a API não informa `exceptionCount`. Consulte o [README principal](../README.md) para instalação, privacidade, limitações, testes, autoria e licença MIT.
