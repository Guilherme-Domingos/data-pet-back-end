[33mcommit 104840b064de04a80071b15dbb9beb9f6c29e42f[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m)[m
Merge: 9b8bdf7 3207d31
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Fri Jun 14 21:51:54 2024 -0300

    Merge branch 'master' of https://github.com/douglasnobree/data-pet-back-end

[33mcommit 9b8bdf7c75e52dae519395d4a30eddaad00d6a8d[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Fri Jun 14 21:51:52 2024 -0300

    feat: Atualizar schema do Animal para permitir valor nulo em data_exclusao
    
    Atualiza o schema do Animal para permitir que o campo data_exclusao aceite um valor nulo, utilizando o método optional().nullable().

[33mcommit 3207d3101f4033571f615a8d6b7c337e28e6536c[m
Merge: 0b813c2 0c9fa31
Author: John <joonleno122213@gmail.com>
Date:   Thu Jun 13 23:54:50 2024 -0300

    Merge branch 'master' of https://github.com/douglasnobree/data-pet-back-end

[33mcommit 0b813c2cab8ee54b8ff22eada18e3ff96a3029c1[m
Author: John <joonleno122213@gmail.com>
Date:   Thu Jun 13 23:54:12 2024 -0300

    12

[33mcommit 0c9fa314c30ce3dcca5c06629d5b8a40501d585a[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Thu Jun 13 23:50:37 2024 -0300

    feat: Corrigir data_exclusao para aceitar valor nulo no schema do Animal
    
    Atualiza o schema do Animal para permitir que o campo data_exclusao aceite um valor nulo, utilizando o método optional().nullable().

[33mcommit c60ae4d0da342b87b92a028e81fcee290d0cbb76[m
Merge: d42054d 1939bfd
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Thu Jun 13 23:00:27 2024 -0300

    Merge branch 'master' of https://github.com/douglasnobree/data-pet-back-end

[33mcommit d42054db4cd7ed1fbbc284db007eb86b0a9d9af9[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Thu Jun 13 23:00:25 2024 -0300

    asdada

[33mcommit 1939bfdb5e3d40d45f8c5f167e38b45ec89b6f7a[m
Merge: daa7d55 5ae1b1f
Author: John <joonleno122213@gmail.com>
Date:   Tue Jun 11 23:32:34 2024 -0300

    Merge branch 'master' of https://github.com/douglasnobree/data-pet-back-end

[33mcommit daa7d5505e65b8c77ada6d98f7d3776f45bb9d00[m
Author: John <joonleno122213@gmail.com>
Date:   Tue Jun 11 23:29:48 2024 -0300

    asdasd

[33mcommit 5ae1b1fc6fd42c69da16b53fc40e67022af6efc0[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Tue Jun 11 20:12:13 2024 -0300

    feat: Adicionar autenticação de veterinário na listagem de animais
    
    Adiciona a autenticação de veterinário na função de listagem de todos os animais, utilizando o guard VetAuthGuard.

[33mcommit 6aecd1ee469fb69a809846280693fd937d42503e[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Tue Jun 11 19:44:29 2024 -0300

    feat: Adicionar campo "senha" ao modelo Veterinario
    
    Atualiza o arquivo schema.prisma para adicionar o campo "senha" ao modelo Veterinario, permitindo armazenar a senha do veterinário.

[33mcommit d1abaf975e106e2c8a87289e7270b8678845f734[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Tue Jun 11 04:37:14 2024 -0300

    feat: Update PDF service to use dynamic base URL for sending messages

[33mcommit f32ab28571cf14d5ab4a3e0a2814185f894c561e[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Tue Jun 11 03:02:38 2024 -0300

    feat: Update PDF generation service to send WhatsApp message with prontuario

[33mcommit 9103eabae694e17d78b3e7af25bbd15ac60ec490[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Mon Jun 10 22:06:44 2024 -0300

    feat: Add Google Fonts to PDF generation
    
    This commit adds Google Fonts to the PDF generation service in order to use the "Dancing Script" font for the placeholder text.

[33mcommit 9a3bcd2c713d372c301194afb725d33a34a07346[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Mon Jun 10 21:38:18 2024 -0300

    feat: Atualizar tipo de dado do campo "sexo" para string
    
    Atualiza o arquivo schema.prisma para alterar o tipo de dado do campo "sexo" de enum para string.

[33mcommit a3c5b04a24db5eb66a1ea609c94cb2433d4eb9f0[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Mon Jun 10 21:24:21 2024 -0300

    feat: Add veterinarioId property to prontuarioDTO
    
    This commit adds the `veterinarioId` property to the `prontuarioDTO` class in order to capture the ID of the veterinarian associated with the prontuario.

[33mcommit 29eab42b30fb4764adcd2bbe7ee2078896b44a53[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Fri Jun 7 18:28:51 2024 -0300

    feat: Adicionar função de listagem de todos os animais

[33mcommit 583bfa7ea221c51f3571b64241daaa2597b377fb[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Mon Jun 3 19:34:32 2024 -0300

    atualização do serviço de geração de pdf. feat: return a buffer

[33mcommit df0f9a4b509799a55b76b478fc217228fec42ee0[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 23:02:36 2024 -0300

    feat: Adicionar dependência "form-data" e "node-fetch"
    
    Atualiza o arquivo package.json para adicionar as dependências "form-data" na versão "^4.0.0" e "node-fetch" na versão "2".

[33mcommit f023d64f105201e71905d81efcbfc4431b8b6887[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 22:04:53 2024 -0300

    feat: Adicionar serviço de PDF e CRUD ao módulo de Prontuário

[33mcommit 1ffa5a3d647a75ae3fe340a1f2584a90cbcfae8d[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 20:51:13 2024 -0300

    refactor: Remove Docker-related files
    
    This commit removes the docker-compose.yml and dockerfile files, as they are no longer needed for the project.

[33mcommit ce5247171bc6163d0b1e569c5bab7b58a5c2b8fc[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 20:40:37 2024 -0300

    feat: Update puppeteer.config.cjs and createProntuario.controller.ts
    
    This commit updates the puppeteer.config.cjs file to conditionally export the cacheDirectory configuration based on the NODE_ENV environment variable. It also modifies the createProntuario.controller.ts file to add a space before the @Post decorator.

[33mcommit 3f022ab1a4755be13a8685313b7982a7f683e3bf[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 20:11:23 2024 -0300

    update path

[33mcommit c35ad48802cac524cb39bb13880ac33a97ef9269[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 20:04:25 2024 -0300

    testando 2

[33mcommit d27d520a598c0fc982b0f05b1b505edf30c7aefa[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 19:48:12 2024 -0300

    testando

[33mcommit 280c8eddbfc1969a68952098ca1b56873fee24ca[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 19:27:04 2024 -0300

    feat: Add @puppeteer/browsers dependency
    
    This commit adds the "@puppeteer/browsers" dependency to the project.

[33mcommit fe36d5b3d20f501e4b70340661d241d68973f61d[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:   Sun Jun 2 19:07:30 2024 -0300

    feat: Adicionar função de listagem de todos os animais
    
    Atualiza o controlador de animais no arquivo animal.controller.ts para adicionar a função `listAllAnimals()`, que retorna todos os animais cadastrados.
    
    Atualiza o serviço de animais no arquivo animal.service.ts para implementar a função `listAllAnimals()`, que utiliza o Prisma para buscar todos os animais no banco de dados.
    
    Atualiza o módulo principal no arquivo app.module.ts para importar o módulo de Prontuário.
    
    Atualiza o controlador de listagem de Prontuário no arquivo listProntuario.controller.ts para incluir as informações do animal e do tutor na busca.
    
    Atualiza o DTO de Prontuário no arquivo prontuarioDTO.ts para incluir os campos `animalId` e `tutorId`.
    
    Atualiza o controlador de criação de Prontuário no arquivo createProntuario.controller.ts para utilizar os novos campos do DTO.

[33mcommit 33fe3b346f6d24fa6a448dbcafb068f851449c92[m
Author: douglasnobree <douglasclaudino543@gmail.com>
Date:  