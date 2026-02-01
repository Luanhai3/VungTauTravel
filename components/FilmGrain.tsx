export default function FilmGrain() {
	return (
	  <div
		className="
		  pointer-events-none
		  fixed inset-0 z-[60]
		  opacity-[0.035]
		  mix-blend-soft-light
		"
		style={{
		  backgroundImage: "url('/noise.png')",
		}}
	  />
	);
  }
  