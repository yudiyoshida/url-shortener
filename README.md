<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Informações técnicas:
- node: 22.11.0
- npm: 10.9.0
- postgres: 14.5

## Descrição
- Este projeto tem como objetivo criar um sistema eficiente de encurtamento de URLs. Com ele, URLs longas e complexas são transformadas em links curtos, simplificando o compartilhamento e a visualização. Além de facilitar o acesso, o sistema registra cada clique em links encurtados, permitindo monitoramento e análise de uso.

### Requisitos cumpridos:
- ✔️ O sistema deve possibilitar o cadastro de usuários e autenticação dos mesmos.
- ✔️ O sistema deve possibilitar que a partir de um url enviado, ele seja encurtado para no máximo 6 caracteres.
- ✔️ Qualquer um pode solicitar que o URL seja encurtado e para encurtar deve existir apenas um endpoint, mas caso seja um usuário autenticado, o sistema deve registrar que o URL pertence ao usuário. Deve retornar o url encurtado - incluindo o domínio.
- ✔️ Um usuário autenticado pode listar, editar o endereço de destino e excluir URLs encurtadas por ele.
- ✔️ Todo acesso a qualquer URL encurtado deve ser contabilizado no sistema.
- ✔️ Quando um usuário listar os urls deve aparecer na listagem a quantidade de cliques.
- ✔️ Todos os registros devem ter uma forma de saber quando foram atualizados.
- ✔️ Os registros só poderão ser deletados logicamente do banco, ou seja, deverá ter um campo que guarda a data de exclusão do registro, caso ela esteja nula é porque ele é válido, caso esteja preenchida é porque ele foi excluído e nenhuma operação de leitura ou escrita pode ser realizada por ele.
- ✔️ Construir endpoints para autenticação de e-mail e senha que retorna um Bearer Token.
- ✔️ Definir o que deve e não deve ser variável de ambiente.
- ✔️ API REST com nível 2 de maturidade de Leonard Richardson.

### Diferenciais:
- ✔️ Docker compose.
- ✔️ Testes unitários, integração e e2e.
- ✔️ Documentação feita no swagger.
- ✔️ Ter validação de entrada em todos os lugares necessários.
- ✔️ Implementado sistema de cache para o acesso das URLs curtas. No primeiro acesso, a URL original é consultada diretamente no banco de dados, enquanto os acessos subsequentes utilizam o cache, reduzindo a carga sobre o banco e melhorando a performance. Em casos de atualização ou exclusão de uma URL, o cache é automaticamente invalidado para garantir a consistência dos dados.

### Rodando a aplicação com Docker compose:
```bash
$ docker compose up --build -d
```
- Caso for subir o projeto na própria máquina, siga os passos abaixo:

### Instalando as dependências:
```bash
$ npm i ou npm install
```

### Variáveis de ambiente:
- Crie uma cópia do arquivo .env.example e renomeie para apenas .env.
- Preenchas as informações corretamente.

### Migrations do banco de dados:
```bash
$ npm run db:migration
```

### Testes:
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

### Rodando a aplicação:
```bash
# development
$ npm run start

# production mode
$ npm run start:prod
```

### Documentação:
```bash
http://localhost:port/swagger
```

### Melhorias:
- Utilizar redis no endpoint que acessa a url curta e redireciona para a url original. Dessa forma, todos os microserviços (se houver uma migração) terão acesso ao cache.
