// Heart toggle that adds/removes a service from the customer's favourites.
// If user isn't logged in, redirects them to /login.

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorited,
} from "../../app/features/favoriteSlice.js";

const FavoriteButton = ({ serviceId, size = 18 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const favorited = useSelector(selectIsFavorited(serviceId));

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (favorited) dispatch(removeFavorite(serviceId));
    else dispatch(addFavorite(serviceId));
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-text-primary hover:text-rose-gold transition-colors"
    >
      {favorited ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <IoHeart className="text-rose-gold" size={size} />
        </motion.span>
      ) : (
        <IoHeartOutline size={size} />
      )}
    </motion.button>
  );
};

export default FavoriteButton;
