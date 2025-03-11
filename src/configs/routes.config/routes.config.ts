import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  {
    key: 'home',
    path: '/home',
    component: lazy(() => import('@/views/Home')),
    authority: [],
  },
  /** Example purpose only, please remove */
  {
    key: 'bookstoreList',
    path: '/consignados',
    component: lazy(() => import('@/views/bookstore/BookstoreList')),
    authority: [],
  },
  {
    key: 'loanList',
    path: '/emprestimos',
    component: lazy(() => import('@/views/loan/LoanList')),
    authority: [],
  },
  {
    key: 'bookstoreView',
    path: '/estoque/:id',
    component: lazy(() => import('@/views/bookstore/BookstoreView')),
    authority: [],
  },
  {
    key: 'bookList',
    path: '/livros',
    component: lazy(() => import('@/views/book/BookList')),
    authority: [],
  },
  {
    key: 'bookView',
    path: '/livro/:id',
    component: lazy(() => import('@/views/book/BookView')),
    authority: [],
  },
  {
    key: 'bookNew',
    path: '/livro/novo',
    component: lazy(() => import('@/views/book/BookNew')),
    authority: [],
  },
  {
    key: 'expenseList',
    path: '/despesas',
    component: lazy(() => import('@/views/expense/ExpenseList')),
    authority: [],
  },
  {
    key: 'incomingList',
    path: '/receitas',
    component: lazy(() => import('@/views/incoming/IncomingList')),
    authority: [],
  },
  {
    key: 'storeList',
    path: '/fornecedores',
    component: lazy(() => import('@/views/store/StoreList')),
    authority: [],
  },
  {
    key: 'storeView',
    path: '/fornecedor/:id',
    component: lazy(() => import('@/views/store/StoreView')),
    authority: [],
  },
  {
    key: 'storeNew',
    path: '/fornecedor/novo',
    component: lazy(() => import('@/views/store/StoreNew')),
    authority: [],
  },
  {
    key: 'publisherList',
    path: '/editoras',
    component: lazy(() => import('@/views/publisher/PublisherList')),
    authority: [],
  },
  {
    key: 'publisherView',
    path: '/editora/:id',
    component: lazy(() => import('@/views/publisher/PublisherView')),
    authority: [],
  },
  {
    key: 'publisherNew',
    path: '/editora/novo',
    component: lazy(() => import('@/views/publisher/PublisherNew')),
    authority: [],
  },
  {
    key: 'branchList',
    path: '/lojas',
    component: lazy(() => import('@/views/branch/BranchList')),
    authority: [],
  },
  {
    key: 'branchView',
    path: '/loja/:id',
    component: lazy(() => import('@/views/branch/BranchView')),
    authority: [],
  },
  {
    key: 'branchNew',
    path: '/loja/novo',
    component: lazy(() => import('@/views/branch/BranchNew')),
    authority: [],
  },
]
