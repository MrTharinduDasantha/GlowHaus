// All stylists — grid view.

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StylistCard from "../../components/user/StylistCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import { fetchStylists } from "../../app/features/stylistSlice.js";

const StylistsPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.stylists);

  useEffect(() => {
    dispatch(fetchStylists({ activeOnly: "true" }));
  }, [dispatch]);

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="text-center mb-10">
        <p className="eyebrow text-rose-gold mb-2">The team</p>
        <h1 className="font-display text-4xl md:text-5xl">Our Stylists</h1>
        <p className="text-text-secondary mt-3 max-w-xl mx-auto">
          Meet the women whose hands, eyes, and unhurried attention bring
          GlowHaus to life every day.
        </p>
      </div>

      {loading ? (
        <Loader fullScreen={false} />
      ) : list.length === 0 ? (
        <p className="text-center text-text-muted py-12">
          No stylists to show.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((s, i) => (
            <StylistCard key={s._id} stylist={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StylistsPage;
