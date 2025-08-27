import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contribute from './pages/Contribute'


function App() {

  
    const router = createBrowserRouter([
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/about",
          element: <About/>
        },
        {
          path: "/contribute",
          element: <Contribute/>
        }
    ])
  
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
