import { LogOut, MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import placeholder from "../assets/placeholder.png"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGoogle, signOut, user } = useAuth();

  const displayName = user?.user_metadata.full_name;

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="mx-auto px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Lets<span className="text-purple-500">.Talk</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
      <div className="hidden md:flex items-center">
        {user ? (
          <div className="flex items-center space-x-4">
            {user.user_metadata.avatar_url && (
              <img src={user.user_metadata.avatar_url} alt={placeholder} className="w-8 h-8 rounded-full object-cover"/>
            )}
            <span className="text-gray-300">{displayName}</span>
            <button onClick={signOut} className="bg-gray-500 hover:bg-gray-700 transition-colors px-3 py-1 rounded flex gap-2 items-center cursor-pointer">Sign Out<LogOut className="size-4"/></button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className="bg-purple-500 hover:bg-purple-700 transition-colors px-3 py-1 rounded cursor-pointer">Sign In</button>
        )}
      </div>

          <div className="md:hidden flex flex-row-reverse gap-2">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
            {user ? (
              <>
                {user.user_metadata.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt={placeholder} className="w-8 h-8 rounded-full object-cover"/>
                )}
              </>
            ) : (
              <button onClick={signInWithGoogle} className="bg-purple-500 hover:bg-purple-700 transition-colors px-3 py-1 rounded cursor-pointer">Sign In</button>
            )}
          </div>
        </div>
      </div>

      

      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Community
            </Link>
            <div>
            {user ? (
              <button onClick={signOut} className="bg-gray-500 hover:bg-gray-700 transition-colors px-3 py-1 rounded flex gap-2 items-center">Sign Out<LogOut className="size-4"/></button>
            ) : (
              <div></div>
            )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
