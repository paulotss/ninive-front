import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  {
    key: 'home',
    path: '/home',
    component: lazy(() => import('@/views/Home')),
    authority: ['branch'],
  },
  /** Example purpose only, please remove */
  {
    key: 'bookstoreList',
    path: '/consignados',
    component: lazy(() => import('@/views/bookstore/BookstoreList')),
    authority: ['admin'],
  },
  {
    key: 'loanList',
    path: '/emprestimos',
    component: lazy(() => import('@/views/loan/LoanList')),
    authority: ['admin'],
  },
  {
    key: 'loanView',
    path: '/emprestimo/:id',
    component: lazy(() => import('@/views/loan/LoanView')),
    authority: ['admin'],
  },
  {
    key: 'bookstoreView',
    path: '/consignado/:id',
    component: lazy(() => import('@/views/bookstore/BookstoreView')),
    authority: ['admin'],
  },
  {
    key: 'bookList',
    path: '/livros',
    component: lazy(() => import('@/views/book/BookList')),
    authority: ['branch'],
  },
  {
    key: 'bookView',
    path: '/livro/:id',
    component: lazy(() => import('@/views/book/BookView')),
    authority: ['admin'],
  },
  {
    key: 'bookNew',
    path: '/livro/novo',
    component: lazy(() => import('@/views/book/BookNew')),
    authority: ['admin'],
  },
  {
    key: 'expenseList',
    path: '/despesas',
    component: lazy(() => import('@/views/expense/ExpenseList')),
    authority: ['admin'],
  },
  {
    key: 'incomingList',
    path: '/receitas',
    component: lazy(() => import('@/views/incoming/IncomingList')),
    authority: ['admin'],
  },
  {
    key: 'storeList',
    path: '/fornecedores',
    component: lazy(() => import('@/views/store/StoreList')),
    authority: ['admin'],
  },
  {
    key: 'storeView',
    path: '/fornecedor/:id',
    component: lazy(() => import('@/views/store/StoreView')),
    authority: ['admin'],
  },
  {
    key: 'storeNew',
    path: '/fornecedor/novo',
    component: lazy(() => import('@/views/store/StoreNew')),
    authority: ['admin'],
  },
  {
    key: 'publisherList',
    path: '/editoras',
    component: lazy(() => import('@/views/publisher/PublisherList')),
    authority: ['admin'],
  },
  {
    key: 'publisherView',
    path: '/editora/:id',
    component: lazy(() => import('@/views/publisher/PublisherView')),
    authority: ['admin'],
  },
  {
    key: 'publisherNew',
    path: '/editora/novo',
    component: lazy(() => import('@/views/publisher/PublisherNew')),
    authority: ['admin'],
  },
  {
    key: 'branchList',
    path: '/lojas',
    component: lazy(() => import('@/views/branch/BranchList')),
    authority: ['admin'],
  },
  {
    key: 'branchView',
    path: '/loja/:id',
    component: lazy(() => import('@/views/branch/BranchView')),
    authority: ['admin'],
  },
  {
    key: 'branchNew',
    path: '/loja/novo',
    component: lazy(() => import('@/views/branch/BranchNew')),
    authority: ['admin'],
  },
  {
    key: 'cashier',
    path: '/caixa',
    component: lazy(() => import('@/views/loan/Cashier')),
    authority: ['branch'],
  },
]
