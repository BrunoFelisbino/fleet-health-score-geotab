# Como contribuir com o Fleet Health Score

Obrigado por ajudar a evoluir este Add-in gratuito para a comunidade MyGeotab.

## Antes de abrir uma issue ou PR

1. Verifique se já existe uma discussão sobre o assunto e descreva o comportamento esperado versus o observado.
2. **Não envie dados reais de clientes**: credenciais, placas, VINs, nomes, motoristas, coordenadas privadas, URLs com tokens, capturas de produção ou exportações contendo informações pessoais.
3. Para reproduções, use exemplos sintéticos, identificadores fictícios e uma base MyGeotab de teste autorizada.
4. Mantenha a alteração focada. Explique impactos nos módulos **Fleet Health Score**, **Fleet Exception 360** e exportações, quando aplicável.

## Verificações

Na raiz do repositório, use Node.js 22:

```bash
node scripts/verify-static.mjs
node scripts/verify-audit.mjs
```

O CI executa esses testes automaticamente em pull requests para `main`. Quando a mudança envolve integração ou dados, descreva os testes **manuais** realizados em uma base MyGeotab autorizada. Nunca use dados confidenciais como fixtures.

## Licença, autoria e marcas

As contribuições submetidas ao projeto devem ser compatíveis com a [licença MIT](LICENSE) do repositório. Preserve os avisos de copyright existentes e atribua corretamente trabalhos de terceiros, incluindo suas licenças quando necessárias.

O projeto foi desenvolvido originalmente por **Bruno Henrique Felisbino Gonçalves** e aceita contribuições da comunidade. É um projeto independente, sem afiliação ou endosso oficial da Geotab. Evite acrescentar logotipos, marcas ou declarações que sugiram aprovação de terceiros sem autorização.

Para orientação de instalação e arquitetura, consulte o [README](README.md).
