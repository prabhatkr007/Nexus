import { Outlet } from "react-router-dom"
import Header from "./Header"
import './styles/loader.css'

export default function Layout({loading}){
    return(
        <main>
            <Header />
            {loading ? <div className="loader-container">
                <div className="loader"></div>
                <h3>Free Server Guys, Please Wait !🦜</h3>
                </div> : null
            }
            <Outlet />

        </main>

        
    )

}

