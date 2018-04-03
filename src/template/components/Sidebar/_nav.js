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
          icon: 'fa fa-table'
        },
      ]
    },
    {
      name: 'Cadastro',
      url: '/cadastro',
      icon: 'fa fa-book',
      children: [
        {
          name: 'Cargos',
          url: '/cadastro/cargos',
          icon: 'fa-table'
        },
        {
          name: 'Tipos de Localizaçāo',
          url: '/cadastro/tipos-localizacao',
          icon: 'fa-table'
        },
        {
          name: 'Filiais',
          url: '/cadastro/filiais',
          icon: 'fa-table'
        },
        {
          name: 'Setores',
          url: '/cadastro/setores',
          icon: 'fa-table'
        },
        {
          name: 'Disciplinas',
          url: '/cadastro/disciplinas',
          icon: 'fa-table'
        },
        {
            name: 'Perfis',
            url: '/cadastro/perfis',
            icon: 'fa-table'
        },
        {
            name: 'Contatos',
            url: '/cadastro/contatos',
            icon: 'fa-table'
        },
        {
            name: 'Ações',
            url: '/cadastro/acoes',
            icon: 'fa-table'
        },
        {
            name: 'Eventos',
            url: '/cadastro/eventos',
            icon: 'fa-table'
        },
        {
            name: 'Turnos',
            url: '/cadastro/turnos',
            icon: 'fa-table'
        },
        {
          name: 'Congregações',
          url: '/cadastro/congregacoes',
          icon: 'fa-table'
        },
        {
          name: 'Redes',
          url: '/cadastro/redes',
          icon: 'fa-table'
        },
        {
          name: 'Tipos de Escola',
          url: '/cadastro/tipos-escola',
          icon: 'fa-table'
        },
        {
          name: 'Estados',
          url: '/cadastro/estados',
          icon: 'fa-table'
        }
      ]
    }
  ]
};
