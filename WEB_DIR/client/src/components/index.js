export const Index = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-emerald-900 via-emerald-400 to-emerald-200 flex flex-col h-screen content-center justify-center text-white">
    <div className="w-1/2 bg-gray-700 m-auto p-10 rounded-xl shadow-2xl inner">
        <div className="p-2">
          <h1 className="font-medium text-5xl">Spotify-ai</h1>
        </div>
        <div className="p-2">
          <p>Welcome to our super cool project.</p>
        </div>
        <div className="p-2">
          <a
            className="transition-all px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
            href="http://localhost:8888/login"
            rel="noopener noreferrer"
          >
            Login
          </a>
        </div>
        </div>
        </div>
  );
};

export default Index;
