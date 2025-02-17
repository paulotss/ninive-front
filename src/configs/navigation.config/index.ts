import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Início',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'livrariaMenu',
        path: '',
        title: 'Livraria',
        translateKey: 'nav.livrariaMenu',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'bookList',
                path: '/livros',
                title: 'Livros',
                translateKey: 'nav.bookList',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'bookstoreList',
                path: '/consignados',
                title: 'Consignados',
                translateKey: 'nav.bookstoreList',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'loanList',
                path: '/emprestimos',
                title: 'Empréstimos',
                translateKey: 'nav.loanList',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'relatoriosMenu',
        path: '',
        title: 'Relatórios',
        translateKey: 'nav.relatoriosMenu',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'incomingList',
                path: '/receitas',
                title: 'Receitas',
                translateKey: 'nav.incomingList',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'expenseList',
                path: '/despesas',
                title: 'Despesas',
                translateKey: 'nav.expenseList',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'storeList',
        path: '/lojas',
        title: 'Lojas',
        translateKey: 'nav.storeList',
        icon: '',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'publishierList',
        path: '/editoras',
        title: 'Editoras',
        translateKey: 'nav.publishierList',
        icon: '',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
