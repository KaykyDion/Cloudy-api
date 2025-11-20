## Endpoints

### Registrar usuário

`POST /users/register`

**Descrição**: Insere um usuário no banco de dados e retorna um token JWT.

**Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "johndoe12344"
}
```

### Login

`GET /users/login/`

**Descrição**: Retorna um token JWT contendo alguns dados do usuário.

**Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "johndoe12344"
}
```

### Buscar usuário pelo ID

`GET /users/:id`

**Descrição**: Retorna usuário com ID igual ao informado no parâmetro da requisição.

**Aviso:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "id": "2ae83s62-916e-4c3d-957c-a6dcaea45459",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "bio": "Full-Stack Developer",
  "profilePhoto": null,
  "createdAt": "2024-12-19T16:42:57.675Z",
  "updatedAt": "2024-12-19T16:44:22.246Z",
  "posts": [],
  "followers": [],
  "following": []
}
```

### Editar perfil

`PUT /users/:id`

**Descrição**: Possibilita ao usuário editar sua bio e sua foto de perfil (Ambos campos são opcionais).

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso e apenas o próprio usuário pode realizar esta ação.

**Body:**

```json
{
  "bio": "Hello, I'm John Doe",
  "profilePhoto": "imageUrl"
}
```

**Exemplo de retorno:**

```json
{
  "message": "User John Doe successfully updated!"
}
```

### Excluir perfil

`DELETE /users/:id`

**Descrição**: Possibilita ao usuário excluir seu próprio perfil.

**Aviso:** É necessário o token JWT de autorização para realizar essa requisição com sucesso e apenas um ADM ou o próprio usuário consegue realizar esta ação.

**Exemplo de retorno:**

```json
{
  "message": "User John Doe successfully deleted!"
}
```

### Pesquisar usuários

`GET /users?page=1&name=`

**Descrição**: Permite pesquisar usuários pela query "name", incluindo paginação (20 usuários por página).

**Aviso:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "users": [
    {
      "id": "7ae93c62-916e-4c3d-957x-x6dcaea45459",
      "name": "xxxxx",
      "email": "xxxx@xxx.xxx",
      "bio": "XXXXXX",
      "profilePhoto": null,
      "createdAt": "2024-12-19T16:42:57.675Z",
      "updatedAt": "2024-12-19T16:44:22.246Z"
    },
    {
      "id": "jdfeed1c-11de-4dea-8f5b-d913e879b822",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "bio": null,
      "profilePhoto": null,
      "createdAt": "2024-12-12T14:36:27.852Z",
      "updatedAt": "2024-12-12T14:36:27.852Z"
    },
    {
      "id": "qw780990x-2a2c-4872-af98-12a3dbf00736",
      "name": "KaykyStaff",
      "email": "staff.kayky@gmail.com",
      "bio": "Co-founder and back-end developer at Cloudy",
      "profilePhoto": null,
      "createdAt": "2024-12-10T17:35:25.946Z",
      "updatedAt": "2024-12-10T17:36:00.285Z"
    }
  ],
  "meta": {
    "page": 1,
    "total": 3
  }
}
```

### Seguir usuário

`POST /users/:id/followers`

**Descrição**: Realiza a ação de seguir o usuário que tem o ID igual ao passado como parâmetro.

**Aviso:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "message": "User successfully followed!"
}
```

### Deixar de seguir usuário

`DELETE /users/:id/followers`

**Descrição**: Realiza a ação de deixar de seguir o usuário que tem o ID igual ao passado como parâmetro.

**Aviso:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "message": "User successfully unfollowed!"
}
```

### Criar publicação

`POST /posts`

**Descrição**: Registra uma nova publicação no banco de dados.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Body:**

```json
{
  "content": "Sejam bem-vindos usuários!"
}
```

**Exemplo de retorno:**

```json
{
  "id": "2b1069b6-46d9-4a50-9982-9dc20461b831",
  "content": "Sejam bem-vindos usuários!",
  "createdAt": "2024-12-11T14:05:50.737Z",
  "updatedAt": "2024-12-11T14:05:50.737Z",
  "ownerId": "ce35064d-3f1c-4872-af98-12a3dbf00736"
}
```

### Editar publicação

`PUT /posts/:id`

**Descrição**: Edita uma publicação no banco de dados.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Body:**

```json
{
  "content": "Hello world!"
}
```

**Exemplo de retorno:**

```json
{
  "id": "2b1069b6-46d9-4a50-9982-9dc20461b831",
  "content": "Hello world!",
  "createdAt": "2024-12-11T14:05:50.737Z",
  "updatedAt": "2024-12-11T14:08:30.737Z",
  "ownerId": "ce35064d-3f1c-4872-af98-12a3dbf00736"
}
```

### Buscar publicação pelo ID

`GET /posts/:id`

**Descrição**: Permite buscar uma publicação no banco de dados pelo ID.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "id": "2b1069b6-46d9-4a50-9982-9dc20461b831",
  "content": "Sejam bem-vindos usuários!",
  "createdAt": "2024-12-11T14:05:50.737Z",
  "updatedAt": "2024-12-11T14:05:50.737Z",
  "ownerId": "ce35064d-3f1c-4872-af98-12a3dbf00736",
  "owner": {
    "name": "KaykyStaff"
  },
  "likes": [
    {
      "id": "5841f5f6-abe0-4afb-ac17-6e6043a311f6",
      "name": "IgorRian"
    }
  ],
  "comments": [
    {
      "id": "5841f5f6-abe0-4afb-ac17-6e6043a311f6",
      "createdAt": "2024-12-11T14:22:52.580Z",
      "content": "Eu sou um dos staffs do app!",
      "owner": {
        "name": "IgorRian",
        "email": "igor.example@gmail.com"
      },
      "_count": {
        "likes": 0
      }
    }
  ]
}
```

### Pesquisar publicações

`GET /posts?text=&page=1`

**Descrição**: Permite buscar publicações pela query "text", cada página pode conter 20 publicações.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "posts": [
    {
      "id": "2b1069b6-46d9-4a50-9982-9dc20461b831",
      "content": "Sejam bem-vindos usuários!",
      "createdAt": "2024-12-11T14:05:50.737Z",
      "updatedAt": "2024-12-11T14:05:50.737Z",
      "ownerId": "ce35064d-3f1c-4872-af98-12a3dbf00736",
      "owner": {
        "name": "KaykyStaff",
        "email": "staff.example@gmail.com"
      },
      "_count": {
        "likes": 1,
        "comments": 0
      }
    },
    {
      "id": "73f9d624-094a-4287-8e87-47e375a2b868",
      "content": "Hello world!",
      "createdAt": "2024-12-19T19:38:04.678Z",
      "updatedAt": "2024-12-19T19:38:04.678Z",
      "ownerId": "7ae93c62-916e-4c3d-957c-a6dcaea45459",
      "owner": {
        "name": "kaykyxxL",
        "email": "example@gmail.com"
      },
      "_count": {
        "likes": 0,
        "comments": 0
      }
    }
  ],
  "meta": {
    "page": 1
  }
}
```

### Excluir publicação

`DELETE /posts/:id`

**Descrição**: Exclui uma publicação no banco de dados pelo ID.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "deletedPost": {
    "id": "862c7aa3-9b4c-4a39-ae82-41dd91feddc6",
    "content": "E essa rede aí ein?",
    "createdAt": "2024-12-05T12:10:24.785Z",
    "updatedAt": "2024-12-05T12:10:24.785Z",
    "ownerId": "c3f35498-7414-45a1-a507-70ad9e662e8e"
  }
}
```

### Dar like em publicação

`GET /posts/:id/likes`

**Descrição**: Permite marcar uma publicação com um "like".

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
"Post successfully liked!"
```

### Remover like de publicação

`DELETE /posts/:id/likes`

**Descrição**: Permite remover o like de uma publicação.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
"Like successfully removed!"
```

### Comentar em publicação

`POST /posts/:postId/comments`

**Descrição**: Permite que usuários comentem em uma publicação.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Body:**

```json
{
  "content": "Ótima publicação!"
}
```

**Exemplo de retorno:**

```json
{
  "id": "5841f5f6-abe0-4afb-ac17-6e6043a311f6",
  "ownerId": "b1cf567a-86fa-4bb2-9560-abc2601ae06f",
  "content": "Ótima publicação!!",
  "createdAt": "2024-12-11T14:22:52.580Z",
  "updatedAt": "2024-12-11T14:22:52.580Z",
  "postId": "2b1069b6-46d9-4a50-9982-9dc20461b831"
}
```

### Editar comentário

`PUT /posts/:postId/comments/:id`

**Descrição**: Permite que usuários editem um comentário em uma publicação.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Body:**

```json
{
  "content": "Comentário editado!"
}
```

**Exemplo de retorno:**

```json
{
  "id": "5841f5f6-abe0-4afb-ac17-6e6043a311f6",
  "ownerId": "b1cf567a-86fa-4bb2-9560-abc2601ae06f",
  "content": "Comentário editado!",
  "createdAt": "2024-12-11T14:22:52.580Z",
  "updatedAt": "2024-12-11T14:24:22.580Z",
  "postId": "2b1069b6-46d9-4a50-9982-9dc20461b831"
}
```

### Excluir comentário

`DELETE /posts/:postId/comments/:id`

**Descrição**: Permite que usuários removam um comentário em uma publicação.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "deletedComment": {
    "id": "5841f5f6-abe0-4afb-ac17-6e6043a311f6",
    "ownerId": "b1cf567a-86fa-4bb2-9560-abc2601ae06f",
    "content": "Comentário editado!",
    "createdAt": "2024-12-11T14:22:52.580Z",
    "updatedAt": "2024-12-11T14:24:22.580Z",
    "postId": "2b1069b6-46d9-4a50-9982-9dc20461b831"
  }
}
```

### Dar like em comentário

`POST /posts/:postId/comments/:id/likes`

**Descrição**: Permite que um usuário dê like em um comentário.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "message": "Comment successfully liked by Kayky D."
}
```

### Remover like de um comentário

`DELETE /posts/:postId/comments/:id/likes`

**Descrição**: Permite que um usuário remova o like de um comentário.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "message": "Like successfully removed from comment by KaykyStaff"
}
```

### Relatar bug

`POST /reports`

**Descrição**: Permite que um usuário reporte um bug.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Body:**

```json
{
  "text": "Hello world!"
}
```

**Exemplo de retorno:**

```json
{
  "id": "6eaa156a-a10a-4aca-b892-5c107d28636a",
  "userId": "cbfeed1c-11de-4dea-8f5b-d913e879b822",
  "text": "Hello world!",
  "createdAt": "2025-11-20T17:13:59.764Z"
}
```

### Buscar relatórios de bug

`GET /reports?userId=""`

**Descrição**: Busca os relatórios de bug, permitindo buscar por usuário ao passar o id do usuário na query.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "id": "6eaa156a-a10a-4aca-b892-5c107d28636a",
  "userId": "cbfeed1c-11de-4dea-8f5b-d913e879b822",
  "text": "Hello world!",
  "createdAt": "2025-11-20T17:13:59.764Z"
}
```

### Editar relatório de bug

`PUT /reports/:id`

**Descrição**: Permite que um usuário edite um relatório de bug.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Body:**

```json
{
  "text": "Hello world UPDATED!"
}
```

**Exemplo de retorno:**

```json
{
  "id": "6eaa156a-a10a-4aca-b892-5c107d28636a",
  "userId": "cbfeed1c-11de-4dea-8f5b-d913e879b822",
  "text": "Hello world UPDATED!",
  "createdAt": "2025-11-20T17:13:59.764Z"
}
```

### Excluir relatório de bug

`DELETE /reports/:id`

**Descrição**: Permite que um usuário exclua um relatório de bug.

**Avisos:** É necessário o token JWT de autorização para realizar essa requisição com sucesso.

**Exemplo de retorno:**

```json
{
  "message": "Report successfully deleted!"
}
```
