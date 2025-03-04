"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const steps = [
  { id: 1, title: "Explore And Apply", description: "Browse through a wide range of sports events, from football and basketball to cricket and tennis." },
  { id: 2, title: "Learn And Collaborate", description: "Engage in interactive sessions and collaborate with peers and mentors." },
  { id: 3, title: "Get Certified And Level Up", description: "Earn certifications and enhance your skills for better career opportunities." },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);

  const toggleStep = (id) => setActiveStep(activeStep === id ? null : id);

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#393677] mb-10">How it works</h2>

      <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-12 w-full max-w-5xl">
        
        <div className="w-full md:w-96 h-64 md:h-96 bg-[#2D1412] text-white flex items-center justify-center rounded-3xl shadow-lg">
          <h3 className="text-3xl font-bold">SS</h3>
        </div>

        
        <div className="flex flex-col items-center gap-4 w-full">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative w-full md:w-96 p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col items-start ${
                activeStep === step.id ? "bg-[#393677] text-white" : "bg-white text-[#393677] border-2 border-[#393677]"
              }`}
            >
              <h3 className={`text-5xl font-extrabold mb-1 ${activeStep === step.id ? "text-white" : "text-[#393677]"}`}>
                {step.id.toString().padStart(2, "0")}
              </h3>
              <h4 className={`text-2xl font-extrabold ${activeStep === step.id ? "text-white" : "text-black"}`}>{step.title}</h4>

              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeStep === step.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="mt-2 text-sm">{step.description}</p>
              </div>

              
              <button className="absolute top-8 right-4 w-8 h-8 flex items-center justify-center border-2 border-[#393677] rounded-full bg-white" onClick={() => toggleStep(step.id)}>
                <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${activeStep === step.id ? "rotate-180 text-[#393677]" : "text-[#393677]"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
