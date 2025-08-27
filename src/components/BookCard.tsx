
'use client';


interface BookCardProps {
  title: string;
  url: string;
  className?: string;
}

export default function BookCard({ title, url, className}: BookCardProps) {
  return (
    <div className={`group perspective mx-12 ${className}`}>
      <div
        className="
          relative w-64 h-96 
          transition-transform duration-500 
          group-hover:scale-105
          rounded-lg overflow-hidden
          hover:rotate-[0.142rad]
          bg-white
        "
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Book Cover wrapper for fill */}
        <div className="absolute inset-0 relative">
          <img
            src={url}
            alt={title}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
