

export function getImageUrl(path?: string | null) {
	if (!path) return null;
  

	if (path.startsWith("http://") || path.startsWith("https://")) {
	  return path;
	}
  

	if (path.startsWith("/")) {
	  return path;
	}
  
	const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
	if (!base) return null;
  

	return `${base}/storage/v1/object/public/places/${path}`;
  }
  