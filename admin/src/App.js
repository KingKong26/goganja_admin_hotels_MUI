import Sidenav from "./components/sidenav";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import Home from "./pages/Home";
import Settings from "./pages/Settings";


export default function App() {
  return (
   <>
   <BrowserRouter>
   
   <Routes>
    <Route path="/" exact element={<Home />}></Route>
    <Route path="/hotels" exact element={<Hotels/>}></Route>
    <Route path="/rooms" exact element={<Rooms />}></Route>
    <Route path="/settings" exact element={<Settings />}></Route>
   </Routes>
   <Sidenav />
   </BrowserRouter>
   </>
  )
}
