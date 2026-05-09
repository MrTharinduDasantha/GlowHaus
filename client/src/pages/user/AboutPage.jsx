// Brand story page — values + interior shot + team photo.

import { motion } from "framer-motion";
import salonInterior from "../../assets/about/salon-interior.png";
import teamPhoto from "../../assets/about/team-photo.png";

const values = [
  {
    title: "Women-only space",
    body: "A sanctuary built for women, by women — where comfort, privacy, and care come first.",
  },
  {
    title: "Unhurried craft",
    body: "Every appointment is allotted real time. No rushed services. No conveyor-belt feeling.",
  },
  {
    title: "Refined products",
    body: "We curate every product on our shelf — sustainable, gentle, and chosen with intention.",
  },
];

const AboutPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="container-luxe py-16 md:py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow text-rose-gold mb-3"
        >
          About GlowHaus
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-5xl md:text-7xl leading-[1.05] max-w-3xl mx-auto"
        >
          Beauty, kept <span className="gradient-text">quiet</span> and{" "}
          <span className="gradient-text">considered</span>.
        </motion.h1>
      </section>

      {/* Salon interior wide */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative h-[60vh] min-h-105 overflow-hidden"
      >
        <img
          src={salonInterior}
          alt="GlowHaus salon interior"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,13,0.4) 0%, rgba(10,10,13,0.95) 100%)",
          }}
        />
      </motion.div>

      {/* Story */}
      <section className="container-luxe py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow text-rose-gold mb-3">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6 leading-[1.1]">
            Founded on a simple idea.
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            GlowHaus began in a quiet two-chair studio above a flower shop —
            opened by three women who wanted a salon they themselves wanted to
            visit. Somewhere unhurried. Somewhere private. Somewhere that
            treated beauty appointments like the small luxuries they are.
          </p>
          <p className="text-text-secondary leading-relaxed">
            That ethos hasn't changed as we've grown. Every chair, every
            stylist, every product on our shelf is chosen with the same care.
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="container-luxe pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 bg-bg-surface border border-line-soft rounded-2xl"
            >
              <h3 className="font-display text-xl text-rose-gold mb-3">
                {v.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {v.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team photo */}
      <section className="container-luxe pb-20 md:pb-28">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-line-soft">
          <img
            src={teamPhoto}
            alt="The GlowHaus team"
            className="w-full h-full object-top"
          />
          <div
            className="absolute inset-0 flex items-end p-8"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, rgba(10,10,13,0.95) 100%)",
            }}
          >
            <div>
              <p className="eyebrow text-rose-gold mb-2">The team</p>
              <h3 className="font-display text-3xl md:text-4xl">
                Women crafting beauty for women.
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
