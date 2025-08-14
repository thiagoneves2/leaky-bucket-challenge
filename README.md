# leaky-bucket-challenge

## Introduction
The **Leaky Bucket** is a traffic shaping algorithm that controls the flow of data by using a fixed-rate output, similar to water leaking from a bucket with a small hole at the bottom. Incoming data is placed into a queue (the “bucket”), and it is transmitted at a constant rate, regardless of how fast it arrives. If the bucket becomes full, excess data is discarded. This ensures a smooth output rate, prevents network congestion, and limits burst traffic.


## Deliverables
- [ ] A node js http server
- [ ] A multi-tenancy strategy to be the owner of requests. For example, you could have users, and each user will have 10 tokens
- [ ] Implement an authentication of users with a Bearer Token
- [ ] This token must be sent in the request Authorization
- [ ] A mutation that simulates a query of a pix key
- [ ] A leaky bucket strategy completed

### Leaky Bucket Strategy
- The query starts with 10 query tokens.
- Each request must consume 1 token. If success it keeps your token, if failed it must decrease 1 token from tokens.
- Every hour 1 token is added to the total number of tokens available for request
- 10 is the max limit of tokens
- Simulate requests validating token strategy with Jest to show that the leaky bucket works
- Generate a postman of the API to be consumed

### Rules
- [ ] It uses GraphQL in the Node Server
- [ ] A frontend that simulates the initiation of a Pix transaction
- [ ] It will fill two fields: pix key and value
- [ ] It must request the backend GraphQL
- [ ] It must use React and Relay at the frontend

## Hard Core

Implement all Leaky Bucket from Dict 

[https://www.bcb.gov.br/content/estabilidadefinanceira/pix/API-DICT.html#section/Seguranca/Limitacao-de-requisicoes](https://www.bcb.gov.br/content/estabilidadefinanceira/pix/API-DICT.html#section/Seguranca/Limitacao-de-requisicoes)

