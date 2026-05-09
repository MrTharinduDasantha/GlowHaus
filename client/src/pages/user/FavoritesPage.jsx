// Customer's saved services.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ServiceCard from "../../components/user/ServiceCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import { fetchFavorites } from "../../app/features/favoriteSlice.js";
import emptyImg from "../../assets/empty-bag.png";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="text-center mb-10">
        <p className="eyebrow text-rose-gold mb-2">Saved</p>
        <h1 className="font-display text-4xl md:text-5xl">Your Favorites</h1>
      </div>

      {loading ? (
        <Loader fullScreen={false} />
      ) : list.length === 0 ? (
        <div className="text-center py-12">
          <img src={emptyImg} alt="" className="w-40 mx-auto opacity-80 mb-4" />
          <p className="text-text-muted mb-4">
            You haven't saved any services yet.
          </p>
          <Link to="/services" className="btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map(
            (f, i) =>
              f.service && (
                <ServiceCard key={f._id} service={f.service} index={i} />
              ),
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
