import Image from "next/image";

export function ProjectDisplayCard({ name, desc, level, image, mentor, tags }) {
  return (
    <div className="border-2 rounded-lg border-violet-400 bg-gradient-to-r from-[#2a283c] to-[#222131] overflow-hidden">
      <div className="w-40 h-40">
        {/* <Image alt="Project Cover Image" src={"/iitp.png"} fill={true} /> */}
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="mt-0.5 text-lg text-white font-bold">{name}</h3>

        <p className="mt-2 line-clamp-3 text-sm/relaxed text-violet-300">
          {desc}
        </p>
        <p className="mt-2 line-clamp-3 font-bold text-xs/relaxed text-violet-300">
          Mentor: {mentor}
        </p>
        <p>
          {/* {tags.map((t) => ( */}
          {/*   <div className="bg-purple-500 text-white rounded-full text-xs"> */}
          {/*     {t} */}
          {/*   </div> */}
          {/* ))} */}
        </p>
      </div>
    </div>
  );
}
