function LandingPage() {
  return (
    <div 
    className="h-screen overflow-y-scroll snap-y snap-mandatory"
     style={{
        background: 'radial-gradient(ellipse 150% 100% at bottom center, #663fce 0%, #0a0010 60%, #000000 100%)',
      }}
    >
      
      {/* 첫 번째 화면 */}
      <section className="h-screen snap-start flex flex-col items-start">
        {/* Flow with NURO 화면 */}
        <img src="src/assets/landingImage.png" alt="landingImage" className="w-full h-4/7 object-cover object-bottom" />
        <div className="w-full h-full flex items-center justify-center">
        <img src="src/assets/landingTitle.png" alt="landingLogo" className="w-2/3 h-auto mb-4" />
        </div>
      </section>

      {/* 두 번째 화면 */}
      <section className="h-screen snap-start flex flex-col">
        <div className="flex-1 bg-purple-500">1줄</div>
        <div className="flex-1 bg-purple-600">2줄</div>
        <div className="flex-1 bg-purple-700">3줄</div>
        <div className="flex-1 bg-purple-800">4줄</div>
      </section>

    </div>
  )
}

export default LandingPage
