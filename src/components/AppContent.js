import React, { createContext, Suspense, useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { AuthProvider, PrivateRoute } from '../AuthProvider';

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <AuthProvider>
      <CContainer className="px-4" lg>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Routes>
            {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={
                      <PrivateRoute>
                        <route.element />
                      </PrivateRoute>
                    }
                  />
                )
              )
            })}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Suspense>
      </CContainer>
    </AuthProvider>
  )
}

export default React.memo(AppContent)
