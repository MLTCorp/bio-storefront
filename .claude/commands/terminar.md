Ao executar este comando:

1. **Gere um resumo da sessao** contendo:
   - O que foi feito - consulte os commits realizados desde o registro no arquivo 'onde_paramos.md'
   - Proximos passos
   - Contexto importante
   - Progresso estimado (%)

2. **Solicite aprovacao** do usuario antes de continuar. Aguarde confirmacao.

3. **Apos aprovacao, salve o arquivo** `onde_paramos.md` no diretorio atual com o resumo em Markdown, incluindo o codigo do ultimo commit.

4. **Envie o resumo ao WhatsApp** via Uazapi:

**IMPORTANTE - EMOJIS E ENCODING:**
- Use ASPAS SIMPLES no curl para evitar problemas de encoding no Windows
- SEMPRE inclua os emojis na mensagem (eles funcionam com aspas simples)
- NAO use arquivo JSON intermediario - envie direto no curl
- Use \n para quebras de linha

```bash
curl --request POST \
  --url https://mltcorp.uazapi.com/send/text \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json; charset=utf-8' \
  --header 'token: 7c517000-571d-4a6a-9701-35016f13a110' \
  --data '{"number":"120363406229077165@g.us","text":"<mensagem>"}'
```

**Formato da mensagem WhatsApp (COM EMOJIS):**
```
Sessao Encerrada

Projeto: [nome do diretorio atual]
Data: [DD/MM/YYYY]

O que foi feito:
- [item 1]
- [item 2]
- [item 3]

Proximos passos:
- [item 1]
- [item 2]

Progresso: [X]%

Commit: [hash]
```

**Exemplo de curl completo:**
```bash
curl --request POST --url https://mltcorp.uazapi.com/send/text --header 'Accept: application/json' --header 'Content-Type: application/json; charset=utf-8' --header 'token: 7c517000-571d-4a6a-9701-35016f13a110' --data '{"number":"120363406229077165@g.us","text":"Sessao Encerrada\n\nProjeto: Bio-Storefront\nData: 24/12/2024\n\nO que foi feito:\n- Item 1\n- Item 2\n\nProximos passos:\n- Item 1\n\nProgresso: 95%\n\nCommit: abc123"}'
```

5. Confirme que o arquivo foi salvo e a mensagem enviada (ou reporte erro).

**NOTAS:**
- Token atual: 7c517000-571d-4a6a-9701-35016f13a110
- Grupo: 120363406229077165@g.us
- Se der "WhatsApp disconnected", avise o usuario para reconectar no painel Uazapi
