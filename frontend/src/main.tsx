import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Notes from './Notes.tsx'
import Notifications from './Notifications.tsx'

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/notes/:userId",
    Component: Notes,
  },
  {
    path: "/notifications",
    Component: Notifications,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <Toaster />
  </StrictMode>,
)
