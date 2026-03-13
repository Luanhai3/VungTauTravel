export default function Dashboard(){

	return(
  
	  <div>
  
		<h1 className="text-3xl font-bold mb-8">
		  Dashboard
		</h1>
  
		<div className="grid grid-cols-3 gap-6">
  
		  <div className="bg-white p-6 rounded-xl">
			<p>Total Places</p>
			<h2 className="text-3xl font-bold">10</h2>
		  </div>
  
		  <div className="bg-white p-6 rounded-xl">
			<p>Articles</p>
			<h2 className="text-3xl font-bold">5</h2>
		  </div>
  
		  <div className="bg-white p-6 rounded-xl">
			<p>Visitors</p>
			<h2 className="text-3xl font-bold">3400</h2>
		  </div>
  
		</div>
  
	  </div>
	)
  }