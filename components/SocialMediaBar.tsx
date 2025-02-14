import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const SocialMediaBar = () => {
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 bg-white shadow-lg p-2 rounded-r-lg bg-gradient-to-b from-indigo-600 to-purple-500">
      <a
        href="https://www.facebook.com/1149325581846362"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2  text-white rounded hover:bg-blue-700 transition"
      >
        <FaFacebook size={24} />
      </a>
      <a
        href="https://x.com/casa_menor"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2  text-white rounded hover:bg-sky-600 transition"
      >
        <FaTwitter size={24} />
      </a>
      <a
        href="https://www.instagram.com/casadelmenordeboyaca/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2  text-white rounded hover:bg-pink-600 transition"
      >
        <FaInstagram size={24} />
      </a>
      <a
        href="https://youtube.com/@casadelmenormarcofidelsuar2903?si=IEJZo2OLK80caoOa"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-white rounded hover:bg-red-600 transition"
      >
        <FaYoutube size={24} />
      </a>
    </div>
  );
};

export default SocialMediaBar;
