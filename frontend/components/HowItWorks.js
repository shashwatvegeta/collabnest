"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, title: "Explore And Apply", description: "Browse through a wide range of projects ranging from blockchain to fullstack,ml,etc." },
  { id: 2, title: "Learn And Collaborate", description: "Engage in interactive sessions and collaborate with peers and mentors." },
  { id: 3, title: "Get Certified And Level Up", description: "Earn certifications and enhance your skills for better career opportunities." },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);

  const toggleStep = (id) => setActiveStep(activeStep === id ? null : id);

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-[#393677] mb-10"
      >
        How it works
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-12 w-full max-w-5xl">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-96 h-64 md:h-96 bg-[#2D1412] text-white flex items-center justify-center rounded-3xl shadow-lg"
        >
          <motion.h3
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-3xl font-bold"
          >
            SS
          </motion.h3>
        </motion.div>

        <div className="flex flex-col items-center gap-4 w-full">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative w-full md:w-96 p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col items-start ${activeStep === step.id ? "bg-[#393677] text-white" : "bg-white text-[#393677] border-2 border-[#393677]"
                }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleStep(step.id)}
            >
              <motion.h3
                className={`text-5xl font-extrabold mb-1 ${activeStep === step.id ? "text-white" : "text-[#393677]"}`}
                animate={{ scale: activeStep === step.id ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.id.toString().padStart(2, "0")}
              </motion.h3>
              <h4 className={`text-2xl font-extrabold ${activeStep === step.id ? "text-white" : "text-black"}`}>{step.title}</h4>

              <motion.div
                className="overflow-hidden w-full"
                initial={{ height: 0 }}
                animate={{ height: activeStep === step.id ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p
                  className="mt-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeStep === step.id ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {step.description}
                </motion.p>
              </motion.div>

              <motion.button
                className="absolute top-8 right-4 w-8 h-8 flex items-center justify-center border-2 border-[#393677] rounded-full bg-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStep(step.id);
                }}
              >
                <motion.div
                  animate={{ rotate: activeStep === step.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-[#393677]" />
                </motion.div>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}