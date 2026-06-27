// import { Outlet } from "react-router-dom";
// import Navbar from "../Components/Navbar";

// export default function Layout() {
//     return (
//         <main className="flex flex-col h-screen gap-14">
//             <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
//                 <Navbar />
//             </div>
//             <div className="flex-1">
//                 <Outlet />
//             </div>
//         </main>
//     );
// }

import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Layout() {
    return (
        <main className="flex flex-col h-screen gap-14">
            <div className="fixed top-0 left-0 w-full h-16 z-50 bg-white shadow-sm">
                <Navbar />
            </div>

            <div className="pt-16">
                <Outlet />
            </div>
        </main>
    );
}