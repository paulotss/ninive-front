import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  {
    key: 'home',
    path: '/home',
    component: lazy(() => import('@/views/Home')),
    authority: ['admin', 'user'],
  },
  /** Example purpose only, please remove */
  {
    key: 'bookstoreList',
    path: '/consignados',
    component: lazy(() => import('@/views/bookstore/BookstoreList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'loanList',
    path: '/emprestimos',
    component: lazy(() => import('@/views/loan/LoanList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'loanView',
    path: '/emprestimo/:id',
    component: lazy(() => import('@/views/loan/LoanView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'bookstoreView',
    path: '/consignado/:id',
    component: lazy(() => import('@/views/bookstore/BookstoreView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'bookList',
    path: '/livros',
    component: lazy(() => import('@/views/book/BookList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'bookView',
    path: '/livro/:id',
    component: lazy(() => import('@/views/book/BookView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'bookNew',
    path: '/livro/novo',
    component: lazy(() => import('@/views/book/BookNew')),
    authority: ['admin', 'user'],
  },
  {
    key: 'expenseList',
    path: '/despesas',
    component: lazy(() => import('@/views/expense/ExpenseList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'incomingList',
    path: '/receitas',
    component: lazy(() => import('@/views/incoming/IncomingList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'storeList',
    path: '/fornecedores',
    component: lazy(() => import('@/views/store/StoreList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'storeView',
    path: '/fornecedor/:id',
    component: lazy(() => import('@/views/store/StoreView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'storeNew',
    path: '/fornecedor/novo',
    component: lazy(() => import('@/views/store/StoreNew')),
    authority: ['admin', 'user'],
  },
  {
    key: 'publisherList',
    path: '/editoras',
    component: lazy(() => import('@/views/publisher/PublisherList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'publisherView',
    path: '/editora/:id',
    component: lazy(() => import('@/views/publisher/PublisherView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'publisherNew',
    path: '/editora/novo',
    component: lazy(() => import('@/views/publisher/PublisherNew')),
    authority: ['admin', 'user'],
  },
  {
    key: 'branchList',
    path: '/lojas',
    component: lazy(() => import('@/views/branch/BranchList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'branchView',
    path: '/loja/:id',
    component: lazy(() => import('@/views/branch/BranchView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'branchNew',
    path: '/loja/novo',
    component: lazy(() => import('@/views/branch/BranchNew')),
    authority: ['admin', 'user'],
  },
  {
    key: 'locationList',
    path: '/locais',
    component: lazy(() => import('@/views/location/LocationList')),
    authority: ['admin', 'user'],
  },
  {
    key: 'locationView',
    path: '/local/:id',
    component: lazy(() => import('@/views/location/LocationView')),
    authority: ['admin', 'user'],
  },
  {
    key: 'locationNew',
    path: '/local/novo',
    component: lazy(() => import('@/views/location/LocationNew')),
    authority: ['admin', 'user'],
  },
  {
    key: 'cashier',
    path: '/caixa',
    component: lazy(() => import('@/views/cashier/Cashier')),
    authority: ['admin', 'user'],
  },
]
