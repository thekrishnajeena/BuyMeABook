import {GoogleLogin} from '@react-oauth/google'
import { Link } from 'react-router-dom';
function Header(){

    interface GoogleResponse {
        credential?: string;
        select_by?: string;
        clientId?: string;
    }

    const responseMessage = (response: GoogleResponse): void => {
        console.log(response)
    };

    const errorMessage = (): void => {
        console.log("Google Login Error");
    };

return (
    <>
<header className="absolute inset-x-0 top-0 z-10 w-full">
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* <!-- lg+ --> */}
        <nav className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex-shrink-0">
                <Link to="/" title="" className="flex">
                    <img className="w-auto h-10 lg:h-20" src="/bmab.png" alt="" />
                </Link>
            </div>

            <button type="button" className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
                {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
                <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>

                {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
                <svg className="hidden w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">

                <Link to="/contribute" title="" className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Contribute </Link>

                <Link to="/about" title="" className="text-base font-medium text-white transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> About </Link>
            </div>

            <div className="items-center justify-center hidden px-4 py-3 ml-10 text-base font-semibold text-white transition-all duration-200 border-transparent rounded-md lg:inline-flex">
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </div>
        </nav>

        {/* <!-- xs to lg --> */}
        <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
            <div className="flow-root">
                <div className="flex flex-col px-6 -my-2 space-y-1">
     
                    <Link to="/contribute" title="" className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> Contribute </Link>

                    <Link to="/about" title="" className="inline-flex py-2 text-base font-medium text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"> About </Link>
                </div>
            </div>

            <div className="px-6 mt-6">
                <Link to="/login" title="" className="inline-flex justify-center px-4 py-3 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md tems-center hover:bg-blue-700 focus:bg-blue-700" role="button"> Get started now </Link>
            </div>
        </nav>
    </div>
</header>
</>
)
}

export default Header;
