export default {
  items: [
    {
      name: 'Dashboard',
      url: '/marketshare',
      icon: 'icon-speedometer',
      children: [
        {
            name: 'Market share',
            url: '/marketshare',
            icon: 'fa fa-caret-right',
            action: 'marketshare.view'
          },
          {
            name: 'Indicadores',
            url: '/dashboard/indicadores',
            icon: 'fa fa-caret-right',
            action: 'indicator.view'
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
          icon: 'fa fa-caret-right',
          action: 'school.view'
        },
        {
            name: 'Distribuição',
            url: '/carteira/distribuicao',
            icon: 'fa fa-list',
            action: 'user-school.view'
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
            icon: 'fa fa-caret-right',
            action: 'action.view'
        },
        {
          name: 'Cargos',
          url: '/cadastro/cargos',
          icon: 'fa fa-caret-right',
          action: 'job-title.view'
        },
        {
            name: 'Congregações',
            url: '/cadastro/congregacoes',
            icon: 'fa fa-caret-right',
            action: 'congregation.view'
        },
        {
            name: 'Disciplinas',
            url: '/cadastro/disciplinas',
            icon: 'fa fa-caret-right',
            action: 'discipline.view'
        },
        {
            name: 'Estados',
            url: '/cadastro/estados',
            icon: 'fa fa-caret-right',
            action: 'state.view'
        },
        {
            name: 'Eventos',
            url: '/cadastro/eventos',
            icon: 'fa fa-caret-right',
            action: 'event.view'
        },
        {
            name: 'Filiais',
            url: '/cadastro/filiais',
            icon: 'fa fa-caret-right',
            action: 'subsidiary.view'
        },
        {
            name: 'Níveis',
            url: '/cadastro/niveis',
            icon: 'fa fa-caret-right',
            action: 'level.view'
        },
        {
            name: 'Perfis',
            url: '/cadastro/perfis',
            icon: 'fa fa-caret-right',
            action: 'profile.view'
        },
        {
            name: 'Redes',
            url: '/cadastro/redes',
            icon: 'fa fa-caret-right',
            action: 'chain.view'
        },
        {
            name: 'Setores',
            url: '/cadastro/setores',
            icon: 'fa fa-caret-right',
            action: 'sector.view'
        },
        {
            name: 'Tipos de Escola',
            url: '/cadastro/tipos-escola',
            icon: 'fa fa-caret-right',
            action: 'school-type.view'
        },
        {
          name: 'Localizações',
          url: '/cadastro/tipos-localizacao',
          icon: 'fa fa-caret-right',
          action: 'localization.view'
        },
        {
            name: 'Turnos',
            url: '/cadastro/turnos',
            icon: 'fa fa-caret-right',
            action: 'shift.view'
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
                icon: 'fa fa-caret-right',
                action: 'user.view'
            },
            {
                name: 'Regras',
                url: '/config/regras',
                icon: 'fa fa-caret-right',
                action: 'rule.view'
            },
            {
                name: 'Permissões',
                url: '/config/permissoes',
                icon: 'fa fa-caret-right',
                action: 'role.view'
            }
        ]
    }
  ]
};