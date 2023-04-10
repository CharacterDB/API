
# CharacterDB/API

This app provides a restful api for CharDB. Due to security considerations, this api is read only.

## Endpoints
| Endpoint | Description |
| :------- | :---------: |
| `GET: /api/characters/` | gives all characters. |
| `GET: /api/characters/:id/` | gives one character of a given character ID. |
| `GET: /api/characters/:symbol/` | gives one character of a given symbol. |
| `GET: /api/characters/?pronunciation=:pronunciation` | delivers all Information on all characters by a given (incomplete) pronunciation. |

### Todo

 - Improve Error Handling
    - bad request errors
