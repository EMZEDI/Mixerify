import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-xl bg-gray-700 text-white w-full min-h-screen">
        <div className="flex flex-row min-h-screen justify-center items-center">
          <div className="text-center">
            <div className="text-emerald-500 font-bold text-7xl">404</div>
            <div className="font-bold text-4xl mt-10">
              This page does not exist
            </div>
            <div className="text-gray-400 font-medium text-sm md:text-xl lg:text-2xl mt-8">
              The page you are looking for could not be found.
            </div>
            <div className="mt-8">
            <Link to='/' className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full py-2 px-4">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
