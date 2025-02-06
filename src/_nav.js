import React from 'react'
import { 
  Boxes, 
  DatabaseZap, 
  Filter,
  Gauge, 
  Hand, 
  KeySquare, 
  LaptopMinimal, 
  LayoutTemplate, 
  Package, 
  Send, 
  ShoppingBag, 
  SquareUserRound, 
  Store, 
  Users, 
  Waypoints, 
  Wrench 
} from 'lucide-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <Gauge className="w-4 h-4 me-2" />,
  },
  {
    component: CNavTitle,
    name: 'Shop',
  },
  {
    component: CNavGroup,
    name: 'Sản phẩm',
    to: '/products',
    icon: <LaptopMinimal className="w-4 h-4 me-2" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Listing'} <Package className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/listings',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Template'} <LayoutTemplate className='w-4 h-4 ms-2' />
          </React.Fragment>
        ),        
        to: '/templates',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Sản phẩm'} <Boxes className='w-4 h-4 ms-2' />
          </React.Fragment>
        ),        
        to: '/products',
      }
    ],
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/orders',
    icon: <ShoppingBag className="w-4 h-4 me-2" />
  },
  {
    component: CNavGroup,
    name: 'Systems',
    to: '/systems',
    icon: <DatabaseZap className="w-4 h-4 me-2" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Cửa hàng'}
            <Store className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/shops',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Nhóm'}
            <Users className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/teams',
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'User'}
            <SquareUserRound className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/users',
      },     
    ],
  },
  {
    component: CNavGroup,
    name: 'Tools',    
    icon: <Wrench className="w-4 h-4 me-2" />,
    items: [
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Proxy'}
            <Waypoints className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),
        to: '/proxies'        
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Token'}
            <KeySquare className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/tools'
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Filter'}
            <Filter className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/filters'
      },
      {
        component: CNavItem,
        name: (
          <React.Fragment>
            {'Notify'}
            <Send className="w-4 h-4 ms-2" />
          </React.Fragment>
        ),        
        to: '/notify'
      }
    ]
  }
]

export default _nav
