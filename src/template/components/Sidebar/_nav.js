export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      children: [
        {
            name: 'Market share',
            url: '#',
            icon: 'fa fa-caret-right'
          },
          {
            name: 'Indicadores',
            url: '#',
            icon: 'fa fa-caret-right'
          }
      ]
    },
    {
      name: 'Carteira',
      url: '/carteira',
      icon: 'fa fa-suitcase',
      children: [
        {
          name: 'Escolas',
          url: '/carteira/escolas',
          icon: 'fa fa-caret-right'
        },
        {
          name: 'Distribuição',
          url: '#',
          icon: 'fa fa-caret-right'
        },
        {
          name: 'Termo de aceite',
          url: '#',
          icon: 'fa fa-caret-right'
        }
      ]
    },
    {
      name: 'Administração',
      url: '/cadastro',
      icon: 'fa fa-edit',
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
            name: 'Níveis',
            url: '/cadastro/niveis',
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
          name: 'Localizações',
          url: '/cadastro/tipos-localizacao',
          icon: 'fa fa-caret-right'
        },
        {
            name: 'Turnos',
            url: '/cadastro/turnos',
            icon: 'fa fa-caret-right'
        }
      ]
    },
    {
      name: 'Relatórios',
      url: '#',
      icon: 'fa fa-files-o',
      children: [
        {
            name: 'Escolas',
            url: '#',
            icon: 'fa fa-caret-right'
        }
      ]
    },
    {
        name: 'Configuração',
        url: '/config',
        icon: 'fa fa-cogs',
        children: [
            {
                name: 'Usuários',
                url: '/config/usuarios',
                icon: 'fa fa-caret-right'
            },
            {
                name: 'Regras',
                url: '/config/regras',
                icon: 'fa fa-caret-right'
            },
            {
                name: 'Permissões',
                url: '/config/permissoes',
                icon: 'fa fa-caret-right'
            }
        ]
    }
  ]
};
