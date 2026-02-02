export default function FilmGrain() {
	return (
	  <div
		className="fixed inset-0 pointer-events-none z-[5] opacity-[0.12]"
		style={{
		  backgroundImage: "url(/noise.png)",
		  mixBlendMode: "overlay",
		}}
	  />
	);
  }
  