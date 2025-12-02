import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center dark:text-white">
    <h1 className="text-6xl font-bold text-primary">404</h1>
    <p className="text-xl mt-4">Page not found</p>
    <Link to="/" className="mt-6 px-6 py-2 bg-primary text-white rounded-full">Go Home</Link>
  </div>
);

export default NotFound;