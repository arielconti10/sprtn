export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Carteira',
      url: '/carteira',
      icon: 'fa fa-suitcase',
      children: [
        {
          name: 'Escolas',
          url: '/carteira/escolas',
          icon: 'fa fa-list'
        },
      ]
    },
    {
      name: 'Cadastro',
      url: '/cadastro',
      icon: 'fa fa-book',
      children: [
        {
            name: 'Ações',
            url: '/cadastro/acoes',
            icon: 'fa fa-caret-right'
        },
        {
          name: 'Cargos',
          url: '/cadastro/cargos',
          icon: 'fa fa-caret-right'
        },
        {
            name: 'Congregações',
            url: '/cadastro/congregacoes',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Contatos',
            url: '/cadastro/contatos',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Disciplinas',
            url: '/cadastro/disciplinas',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Estados',
            url: '/cadastro/estados',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Eventos',
            url: '/cadastro/eventos',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Filiais',
            url: '/cadastro/filiais',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Perfis',
            url: '/cadastro/perfis',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Redes',
            url: '/cadastro/redes',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Setores',
            url: '/cadastro/setores',
            icon: 'fa fa-caret-right'
        },
        {
            name: 'Tipos de Escola',
            url: '/cadastro/tipos-escola',
            icon: 'fa fa-caret-right'
        },
        {
          name: 'Tipos de Localizaçāo',
          url: '/cadastro/tipos-localizacao',
          icon: 'fa fa-caret-right'
        },
        {
            name: 'Turnos',
            url: '/cadastro/turnos',
            icon: 'fa fa-caret-right'
        }
      ]
    }
  ]
};
