# Fleet Health Score — Add-In aberto para MyGeotab

Projeto reutilizável para calcular indicadores técnicos de telemetria, visualizar a saúde da frota e analisar exceções. Nenhum nome, logotipo, endereço, placa, e-mail ou dado de demonstração é necessário no código-fonte.

**Os dados são consultados quando o usuário utiliza o Add-In, por meio da API autenticada do MyGeotab.** O repositório não hospeda nem sincroniza automaticamente dados de clientes.

## Funcionalidades

- **Fleet Health Score** (página principal): saúde da frota, filtros, indicadores, mapa, CSV e PDF.
- **Fleet Exception 360** (pasta exceptions): eventos de exceção, regras, mapa, CSV e PDF.
- **Identidade configurável** (arquivo branding.js): nome da organização, logotipo, ícone, site do QR Code e fonte dos PDFs, salvos no banco MyGeotab.
- **Sem dados simulados**: sem sessão ou leituras suficientes, o painel informa a ausência. Não gera histórico fictício.

## Instalação

1. Publique estes arquivos numa hospedagem HTTPS, como GitHub Pages ou um servidor de sua escolha.
2. Abra o arquivo addin-config.json e substitua SEU_HOST_PUBLICO pela origem HTTPS onde estão as páginas. Mantenha os caminhos index.html e exceptions/.
3. Instale o JSON em MyGeotab → Configurações do sistema → Add-Ins.
4. Abra o Fleet Health Score, clique em **Personalizar identidade** e escolha nome, logotipo e ícone (URL HTTPS ou PNG/JPG/WebP), site para o QR Code e a tipografia.
5. Salve. As configurações são recuperadas do banco Geotab atual em novas sessões, respeitando as permissões do usuário.

Não coloque URLs de clientes, imagens privadas ou segredos no repositório nem em commits. Credenciais vêm da sessão MyGeotab.

## Armazenamento e isolamento por cliente

As preferências usam a API **AddInData**, com um AddInId próprio e escopo de grupo da base atual, dentro do banco MyGeotab. O limite oficial é de **10.000 caracteres por registro**. Arquivos de imagem são reduzidos no navegador; se forem grandes, hospede-os em HTTPS numa infraestrutura controlada pelo cliente.

Usuários com acesso somente de leitura podem visualizar a identidade já salva, mas não têm garantida a permissão para alterá-la. O formulário exibe mensagens de erro da API.

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
