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
          name: 'Filiais',
          url: '/cadastro/filiais',
          icon: 'fa-table'
        },
        {
          name: 'Setores',
          url: '/cadastro/setores',
          icon: 'fa-table'
        }
      ]
    }
  ]
};
