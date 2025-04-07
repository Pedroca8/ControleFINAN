# Controle Financeiro Pessoal

Um aplicativo web progressivo (PWA) para controle e gerenciamento de finanças pessoais.

## Principais Funcionalidades

- Registro de transações (entradas e saídas)
- Acompanhamento de saldo atual
- Gerenciamento de rendas fixas mensais
- Gerenciamento de contas fixas mensais
- Filtros por período para análise de gastos
- Visualização de relatórios com gráficos
- Exportação de dados

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage para persistência de dados
- Chart.js para visualização de dados
- PWA (Progressive Web App) para funcionamento mobile

## Como Instalar em Dispositivos Móveis

Este aplicativo foi configurado como um PWA (Progressive Web App), o que significa que você pode instalá-lo em seu smartphone ou tablet e usá-lo como um aplicativo nativo.

### Para instalar no Android:

1. Abra o site do aplicativo em seu navegador Chrome
2. Aguarde alguns segundos e você verá um banner "Adicionar à tela inicial"
3. Toque em "Instalar" ou "Adicionar à tela inicial"
4. O aplicativo será instalado e aparecerá em sua tela inicial

### Para instalar no iPhone (iOS):

1. Abra o site do aplicativo no Safari
2. Toque no ícone de compartilhamento (o quadrado com a seta para cima)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Dê um nome ao aplicativo (ou deixe o padrão)
5. Toque em "Adicionar" no canto superior direito
6. O aplicativo será adicionado à sua tela inicial

## Recursos Offline

Este aplicativo funciona offline! Uma vez que você o tenha carregado, poderá acessá-lo mesmo sem conexão à internet. Seus dados serão sincronizados quando você voltar a ficar online.

## Configuração para Desenvolvedores

Para desenvolver ou modificar este aplicativo:

1. Clone o repositório
2. Abra o arquivo `index.html` em seu navegador
3. Para testar os recursos de PWA, você precisará servir os arquivos através de um servidor HTTP.
   Você pode usar o servidor integrado Python:
   ```bash
   python -m http.server
   ```
   Ou instalar o http-server via npm:
   ```bash
   npm install -g http-server
   http-server
   ```

### Personalização dos Ícones

Os ícones do aplicativo estão na pasta `/icons`. Você pode substituí-los por seus próprios ícones, mantendo os mesmos nomes e dimensões.

Se você tiver Node.js instalado, pode gerar novos ícones usando o script na pasta `/icons`:
```bash
cd icons
npm install canvas
node generate-icon.js
```

## Privacidade

Seus dados financeiros são armazenados localmente no seu dispositivo e não são enviados a nenhum servidor.

---

Desenvolvido por Pedro Henrique