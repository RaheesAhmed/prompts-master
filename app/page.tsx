"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-fit pb-12 flex flex-col md:flex-row bg-white">
        <div className="left h-fit pb-5 w-full flex pt-10 flex-col md:h-full md:pt-[7vw] md:w-1/2">
          <p className="main-head text-left pl-10 font-bold text-3xl text-[black] md:pl-[7vw] md:text-4xl lg:text-[4vw] lg:leading-tight">
            <span className="text-[#673DE6] font-bold">Elevate</span> your
            <br />
            LLM prompts to
            <br />
            <span className="font-bold">Perfection.</span>
          </p>
          <p className="pl-10 pr-5 font-semibold text-left text-lg py-2 md:pl-[7vw]">
            Supercharge your AI development with our cutting-edge LLM Prompts!
          </p>
          <div className="pl-10 pt-6 md:pl-[7vw]">
            <Link
              className="px-10 py-3 bg-[#673DE6] rounded-md text-white"
              href="/prompts"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="right mt-2 flex-1 p-1 lg:p-10 h-1/2 w-full flex lg:pt-5 flex-col md:h-full md:p-0 md:w-1/2">
          <img
            src="/main2.jpg"
            alt=""
            className="w-full object-contain h-full lg:h-[80%]"
          />
        </div>
      </div>
      <div
        className="section bg-white  h-fit bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url("/layered-waves-haikei (1).svg")` }}
      >
        <div className="title text-center text-4xl font-bold text-[black]">
          Our Services
        </div>
        <div className="p-10 flex flex-wrap gap-6 justify-center items-center lg:gap-8">
          <div className="card bg-[white] ring-1 ring-[#8b85ff94] w-96 h-64 lg:h-72 shadow-sm border border-[#00000024] rounded-3xl p-5 lg:p-10">
            <div className="icon flex justify-center">
              <img src="/clipboard_2669785.png" alt="" className="w-14" />
            </div>
            <p className="text-center font-bold text-xl lg:text-2xl py-2  text-[#2F1C9A]">
              Prompt Evaluation
            </p>
            <p className="text-center text-base lg:text-lg">
              Test your prompts with various LLMs, including GPT - 3, GPT - 4,
              and more
            </p>
          </div>
          <div className="card bg-white ring-1 ring-[#8b85ff94] w-96 h-64 lg:h-72 shadow-sm border border-[#00000024] rounded-3xl p-5 lg:p-10">
            <div className="icon flex justify-center">
              <img src="/up-arrow.png" alt="" className="w-14" />
            </div>
            <p className="text-center font-bold text-xl lg:text-2xl py-2 text-[#2F1C9A]">
              Performance Metrics
            </p>
            <p className="text-center text-base lg:text-lg">
              Get detailed insights into the effectiveness of your prompts with
              our comprehensive metrics.
            </p>
          </div>
        </div>
        <div className="px-10 pb-10 flex flex-wrap gap-6 justify-center lg:gap-8">
          <div className="card ring-1 ring-[#8b85ff94] bg-white w-96 h-64 lg:h-72 shadow-sm border border-[#00000024] rounded-3xl p-5 lg:p-10">
            <div className="icon flex justify-center">
              <img src="/test_3022254.png" alt="" className="w-14" />
            </div>
            <p className="text-center font-bold text-xl lg:text-2xl py-2 text-[#2F1C9A]">
              Test Case Management
            </p>
            <p className="text-center text-base lg:text-lg">
              Define and manage test cases to ensure your prompts cover critical
              scenarios.
            </p>
          </div>
          <div className="card ring-1 ring-[#8b85ff94] bg-white w-96 h-64 lg:h-72 shadow-sm border border-[#00000024] rounded-3xl p-5 lg:p-10">
            <div className="icon flex justify-center">
              <img src="/feedback.png" alt="" className="w-14" />
            </div>
            <p className="text-center font-bold text-xl lg:text-2xl py-2 text-[#2F1C9A]">
              Real - time Feedback
            </p>
            <p className="text-center text-base lg:text-lg">
              Receive instant feedback on your prompts to make quick and
              informed adjustments.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
