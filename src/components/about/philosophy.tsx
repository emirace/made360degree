"use client";

import { motion } from "framer-motion";
import {
  Box,
  Heart,
  Zap,
  Target,
  FileCheck,
  Brain,
  Repeat,
} from "lucide-react";

const Philosophy = () => {
  const principles = [
    {
      title: "Structured",
      subtitle: "Not abstract",
      icon: <FileCheck className="h-6 w-6" />,
      description:
        "Rigorous frameworks and measurable processes that turn vision into tangible results.",
    },
    {
      title: "Human",
      subtitle: "Not mechanical",
      icon: <Heart className="h-6 w-6" />,
      description:
        "Rooted in empathy and emotional intelligence, because leadership is about people, not machines.",
    },
    {
      title: "Strategic",
      subtitle: "Not motivational noise",
      icon: <Target className="h-6 w-6" />,
      description:
        "Calculated moves and intentional growth strategies that bypass the fluff for real impact.",
    },
  ];

  const coreValues = [
    { name: "Clarity", icon: <Brain />, delay: 0 },
    { name: "Discipline", icon: <Repeat />, delay: 0.1 },
    { name: "Emotional Intelligence", icon: <Zap />, delay: 0.2 },
    { name: "Consistent Execution", icon: <Box />, delay: 0.3 },
  ];

  return (
    <section className="bg-white text-black py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full border border-black/10 text-xs font-bold tracking-widest uppercase"
          >
            Our Philosophy
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl"
          >
            Where many focus on inspiration alone, we focus on{" "}
            <span className="text-primary italic">application.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-black/60 max-w-2xl"
          >
            We believe leadership is developed through clarity, discipline,
            emotional intelligence, and consistent execution.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((principle, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[40px] border border-black/5 bg-[#F8F9FA] hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                {principle.icon}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="text-sm font-bold text-primary uppercase tracking-wider">
                    {principle.subtitle}
                  </p>
                </div>
                <p className="text-black/60 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 pt-20 border-t border-black/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: value.delay }}
                className="flex flex-col items-center gap-4 text-center group"
              >
                <div className="h-10 w-10 text-black/20 group-hover:text-primary transition-colors duration-300">
                  {value.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
                  {value.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
