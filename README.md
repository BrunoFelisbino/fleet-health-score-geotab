# Fleet Health Score — Add-In aberto para MyGeotab

Projeto reutilizável para calcular indicadores técnicos de telemetria, visualizar a saúde da frota e analisar exceções. Nenhum nome, logotipo, endereço, placa, e-mail ou dado de demonstração é necessário no código-fonte.

**Os dados são consultados quando o usuário utiliza o Add-In, por meio da API autenticada do MyGeotab.** O repositório não hospeda nem sincroniza automaticamente dados de clientes.

## Funcionalidades

- **Fleet Health Score** (página principal): saúde da frota, filtros, indicadores, mapa, CSV e PDF.
- **Fleet Exception 360** (pasta exceptions): eventos de exceção, regras, mapa, CSV e PDF.
- **Configurar PDF** (arquivo branding.js): envio de PNG com prévia, link do QR Code, nome, ícone e fonte, salvos no banco MyGeotab.
- **Sem dados simulados**: sem sessão ou leituras suficientes, o painel informa a ausência. Não gera histórico fictício.

## Instalação

1. Publique estes arquivos numa hospedagem HTTPS, como GitHub Pages ou um servidor de sua escolha.
2. Abra o arquivo addin-config.json e substitua SEU_HOST_PUBLICO pela origem HTTPS onde estão as páginas. Mantenha os caminhos index.html e exceptions/.
3. Instale o JSON em MyGeotab → Configurações do sistema → Add-Ins.
4. Abra o Fleet Health Score ou o Fleet Exception 360 e clique em **Configurar PDF**. Envie um **PNG** para ser usado nos cabeçalhos/capa do PDF e informe a **URL HTTPS** do QR Code. Em **Outras opções de identidade**, configure nome, ícone e fonte. O envio de imagem por URL HTTPS também é permitido.
5. Salve. As configurações são recuperadas do banco Geotab atual em novas sessões, respeitando as permissões do usuário.

Não coloque URLs de clientes, imagens privadas ou segredos no repositório nem em commits. Credenciais vêm da sessão MyGeotab.

## Armazenamento e isolamento por cliente

As preferências usam a API **AddInData**, com um AddInId próprio e escopo de grupo da base atual, dentro do banco MyGeotab. O limite oficial é de **10.000 caracteres por registro**. O PNG (até 5 MB na seleção) é redimensionado no navegador, preservando o formato PNG, e dividido em até 16 registros menores quando necessário. A configuração contém somente referências aos fragmentos e os campos de identidade. Se a imagem continuar grande demais, use um PNG mais simples ou uma URL HTTPS sob controle de quem instala. O arquivo PNG e o site escolhido **não entram no repositório público**.

Usuários com acesso somente de leitura podem visualizar a identidade já salva, mas não têm garantida a permissão para alterá-la. O formulário exibe mensagens de erro da API. A identidade é compartilhada pelos usuários autorizados da mesma base Geotab. A substituição e a exclusão de um PNG removem os fragmentos antigos depois de confirmar a nova configuração, quando a conta tem permissão de exclusão.

**Ícone do menu lateral:** a Geotab define esse ícone pelo JSON de instalação, antes de executar a página do Add-In. Por isso o arquivo distribuído não fixa svgIcon. O instalador pode colocar a URL do seu próprio ícone no JSON; os ícones **dentro das páginas e PDFs** podem ser configurados após vincular a conta.

Para instalar diferentes forks deste Add-In no mesmo banco Geotab, gere identificadores AddInId próprios no branding.js, evitando compartilhar coleções de configurações.

## Origem dos dados

O Add-In consulta as entidades permitidas pela sessão (Device, DeviceStatusInfo, StatusData, FaultData, Group, Rule e ExceptionEvent). Os cálculos dependem da disponibilidade real de telemetria. A interpretação do score é auxiliar: possíveis desconexões não comprovam remoção não autorizada e merecem verificação técnica.

## Reproduzir e contribuir

Este projeto é código livre sob a **licença MIT** (LICENSE). Você pode hospedar, usar e modificar sua cópia. Não publique dados pessoais, marcas de clientes, bancos de produção nem arquivos privados em commits, PRs e issues.

## Testes de aceite

- Testar dashboard e exceções dentro de uma base MyGeotab autorizada.
- Confirmar textos acentuados, indicadores, filtros e exportação CSV UTF-8.
- Gerar os dois PDFs com e sem identidade configurada e confirmar o destino do QR Code.
- Salvar identidade em uma base e confirmar que não aparece em outra.
- Verificar que sem sessão ou dados suficientes o sistema não inventa estatísticas nem imagens de marca.

## Configuração do PDF e do QR Code

O botão **Configurar PDF** aparece no cabeçalho das duas páginas do Add-In após a conexão com o MyGeotab. Ele permite:

- Selecionar um arquivo **PNG** (até 5 MB) para a imagem institucional do PDF, com prévia antes de salvar;
- Substituir, remover ou usar uma imagem publicada em HTTPS;
- Informar o endereço HTTPS do QR Code. Se o campo estiver vazio, o PDF será gerado sem QR Code;
- Ajustar, opcionalmente, nome, ícone do painel e família tipográfica dos PDFs.

A imagem é usada na capa e nos cabeçalhos das páginas dos dois relatórios. O QR Code é gerado com o endereço escolhido no formulário e aparece na última página. Para renderizar o QR Code, a versão atual solicita a imagem ao serviço público `api.qrserver.com`, transmitindo **somente a URL configurada** nesse serviço. Se o QR Code não carregar, o link não deve ser considerado validado; faça a conferência no PDF gerado.

**Nota sobre ícones do menu MyGeotab:** o ícone do menu é definido pelo JSON de instalação, antes da página do Add-In iniciar. O botão configura o ícone exibido **dentro da página**; a imagem PNG configurada separadamente é utilizada nos PDFs. Ele não altera retroativamente o ícone do menu lateral do MyGeotab.
