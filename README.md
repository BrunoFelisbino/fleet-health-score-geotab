# Fleet Health Score — Add-in gratuito para MyGeotab

**Fleet Health Score** é um Add-in de código aberto para análise técnica da saúde da frota no MyGeotab. O projeto reúne indicadores de telemetria, diagnóstico e exceções em painéis com filtros, mapas e relatórios.

**Desenvolvimento original:** [Bruno Henrique Felisbino Gonçalves](https://github.com/BrunoFelisbino)  
**Licença:** [MIT](LICENSE) · **Uso gratuito**, inclusive em ambientes comerciais.

> Projeto independente da comunidade. Não é um produto oficial da Geotab, nem implica afiliação ou endosso da Geotab.

## O que está disponível

| Módulo | Recursos |
| --- | --- |
| **Fleet Health Score** | Score técnico da frota, indicadores de comunicação e tensão, filtros por grupo/veículo, distribuição de risco, mapa, CSV e PDF. |
| **Fleet Exception 360** | Eventos de `ExceptionEvent`, regras, ranking por instâncias, mapa, filtros, CSV, PDF resumo e auditoria detalhada por veículo. |
| **Configurar PDF** | Identidade visual opcional dos relatórios: PNG, nome, ícone, fonte e URL HTTPS usada no QR Code. |

Os indicadores são **heurísticos** e dependem das informações disponíveis na base conectada. Um alerta técnico não comprova falha, remoção indevida ou conduta irregular sem investigação. Quando faltam dados, o painel deve indicar ausência ou indisponibilidade, sem criar leituras fictícias.

## Instalação no MyGeotab

1. Utilize o arquivo [`addin-config.json`](addin-config.json) para a versão hospedada no GitHub Pages. Atualmente a configuração está em **0.6.2** e inclui os menus **Fleet Health Score** e **Fleet Exception 360**.
2. No **MyGeotab → Administração → Sistema → Configurações do sistema → Add-Ins**, instale a configuração JSON ou atualize o Add-in existente. A localização desse menu pode variar conforme a versão e as permissões da conta.
3. Salve e recarregue o MyGeotab. Abra um dos dois módulos com uma sessão autorizada.
4. Se desejar personalizar os PDFs, use **Configurar PDF** dentro do módulo e salve a identidade visual.

Para hospedar a sua própria cópia, publique os arquivos estáticos em **HTTPS** e parta de [`addin-config.example.json`](addin-config.example.json), substituindo `SEU_HOST_PUBLICO` pela origem da sua hospedagem. Ajuste as URLs de ambos os menus, não apenas da página principal.

O caminho legado [`reports/`](reports/) continua disponível como entrada de compatibilidade para instalações anteriores. O JavaScript executado na página não modifica automaticamente o JSON já instalado na conta MyGeotab.

## Como o Add-in utiliza dados

- As consultas ocorrem **durante o uso**, com as permissões da sessão autenticada no **MyGeotab**, por meio da API disponibilizada ao Add-in.
- São consultadas entidades como `Device`, `DeviceStatusInfo`, `StatusData`, `FaultData`, `Group`, `Rule` e `ExceptionEvent`, conforme a funcionalidade e os dados autorizados.
- O GitHub Pages disponibiliza os **arquivos estáticos**; o repositório não recebe um espelho da base, não guarda credenciais e não sincroniza automaticamente os dados de clientes.
- As preferências de identidade dos PDFs podem ser armazenadas na base conectada via **AddInData**. Há também uma opção de salvamento **somente no navegador**, quando identificada a base.
- Mapas e outros recursos podem depender de serviços externos. A geração do QR Code usa `api.qrserver.com` e transmite **a URL HTTPS configurada para o QR Code** a esse serviço; evite informar links privados ou com tokens sensíveis.

**Privacidade:** nunca adicione credenciais, capturas com dados de clientes, placas reais, nomes de motoristas, chaves de API ou dados operacionais a commits, issues ou pull requests públicos.

## PDFs, identidade visual e isolamento

Em **Configurar PDF**, o usuário autorizado pode definir uma imagem PNG (até 5 MB na seleção), usar uma imagem de URL HTTPS, informar o destino do QR Code e personalizar nome, ícone e fonte. A imagem é otimizada no navegador; quando armazenada no MyGeotab, pode ser distribuída em fragmentos `AddInData`. Um PNG demasiado grande pode exigir simplificação ou hospedagem própria.

- As preferências salvas na **base MyGeotab** são compartilhadas com usuários autorizados daquela base, conforme as permissões da API.
- **Salvar somente neste navegador** não sincroniza a identidade com outros usuários ou dispositivos.
- O **ícone do menu lateral** é definido pelo JSON de instalação, não pelo formulário de identidade; o formulário personaliza a interface interna e os PDFs.
- Para instalar forks diferentes no **mesmo banco**, defina identificadores próprios de `AddInData` no `branding.js` para evitar conflito de configurações.

No **Fleet Exception 360**, a ação **Baixar PDF** oferece dois formatos:

- **Resumo:** quatro páginas com capa, indicadores, ranking e plano de ação.
- **Auditoria detalhada:** as páginas de resumo e uma seção paginada com eventos por veículo, regras traduzidas quando disponíveis, nomes originais, horários, duração, estado e identificadores.

Cada veículo do ranking permite abrir sua auditoria e exportar os dados correspondentes. Horários exibidos são convertidos para o fuso do navegador; quando a API não fornece a contagem exata de instâncias, o relatório sinaliza o mínimo observado.

## Estrutura do projeto

| Caminho | Finalidade |
| --- | --- |
| `index.html` | Painel Fleet Health Score |
| `exceptions/` | Fleet Exception 360, auditoria e PDF |
| `branding.js` | Preferências e identidade dos PDFs |
| `health-pdf.js` | Relatório PDF do painel de saúde |
| `reports/` | Estilos e rota de compatibilidade |
| `translations/` | Recursos de tradução |
| `addin-config.json` | Instalação pública apontando para o GitHub Pages |
| `addin-config.example.json` | Modelo para hospedagem própria |
| `scripts/` | Testes estáticos e de auditoria |

## Testes e validação

Com **Node.js 22** (também utilizado no GitHub Actions), execute na raiz do projeto:

```bash
node scripts/verify-static.mjs
node scripts/verify-audit.mjs
```

Antes de disponibilizar alterações, valide também manualmente em uma base **MyGeotab autorizada**: carregamento das duas páginas, filtros, caracteres acentuados, exportações CSV, PDFs com e sem identidade, permissões de `AddInData` e ausência de resultados inventados quando faltam dados.

Os testes automatizados verificam aspectos estáticos e a geração de PDF de auditoria; **não substituem os testes de integração com uma base real**.

## Contribuir, autoria e licença

O Fleet Health Score é gratuito e aberto a contribuições. Para correções, sugestões e pull requests, consulte [CONTRIBUTING.md](CONTRIBUTING.md). Ao relatar problemas, utilize exemplos sintéticos e remova dados que identifiquem clientes.

**Criador original:** [Bruno Henrique Felisbino Gonçalves](https://github.com/BrunoFelisbino). A contribuição de outras pessoas é bem-vinda e deve receber reconhecimento apropriado.

Distribuído sob a **licença MIT**. Cópias e partes substanciais do software devem preservar o texto da licença e o aviso de copyright. **A MIT não exige que forks mantenham os créditos visíveis na interface**, embora isso seja incentivado como boa prática.

## Versão da distribuição

A configuração pública deste repositório identifica a versão **0.6.2**. Em instalações já existentes, atualize o JSON do Add-in na conta quando necessário e valide o comportamento após a atualização. Alterações de documentação não substituem a instalação nem o teste no MyGeotab.
