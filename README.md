# README #

O Projeto Spartan é uma revisão da força de vendas do time comercial da FTD Educação. Nessa nova versão estamos utilizando uma abordagem mista e distribuida de ferramentas e componentes WEB.

Esse é o repositório Front-End da aplicação e a seguir existe toda a documentação e regras necessárias para subir o ambiente e efetuar os ajustes necessários seguindo o padrão de desenvolvimento do Time WEB.

### Configuração do ambiente ###

Estou utilizando o ambiente c9.io para montar esse ambiente, entretanto, você pode utilizar o ambiente de sua preferência. Siga os passos abaixo:

* Pré-requisitos

Node, Bower

* Instalação

~~~~
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
~~~~

Depois da execução dos comandos acima vá até a pasta do projeto

~~~~
$ cd <path-projeto>/ftdspartanf
$ bower update
~~~~

Esse comando irá baixar e instalar os componentes necessários a aplicação dentro da pasta bower_components

Obs: Não efetue o **commit** do conteúdo da pasta components.

### Estrutura de pastas ###

Tudo que é relacionado as telas (js, css) deve ficar dentro da pasta templates do projeto. Por convenção o nome da pasta é definido de acordo com o nome da *tabela* do BD que está sendo construído.

~~~~
[...]
└── templates
    ├── profile << NOME DA TABELA (MODEL)
    └── school
~~~~
