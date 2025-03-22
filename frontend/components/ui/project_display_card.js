import Image from "next/image";
import Link from "next/link";

export function ProjectDisplayCard({ name, desc, level, image, ownerName, ownerEmail, tags, id }) {
  return (
    <div className="border-2 rounded-lg border-violet-400 bg-gradient-to-r from-[#2a283c] to-[#222131] overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-36">
        <Image
          alt="Project Cover Image"
          src={image || "/project-placeholder.png"}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
            {level}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg text-white font-bold mb-2">{name}</h3>
        
        <p className="text-sm text-violet-300 line-clamp-2 mb-2 flex-1">
          {desc}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {(tags || []).slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-block bg-violet-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {(tags || []).length > 3 && (
            <span className="inline-block bg-violet-900/60 text-violet-200 px-2 py-0.5 rounded-full text-xs">
              +{tags.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-violet-900/30">
          <p className="font-medium text-xs text-violet-300">
            Mentor: {ownerName || 'Unknown'}
            {ownerEmail && (
              <span className="block text-xs text-violet-400/70 mt-1">
                {ownerEmail}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
