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
        <img src="src/assets/landing1/landingImage.png" alt="landingImage" className="w-full h-4/7 object-cover object-bottom" />
        <div className="w-full h-full flex items-center justify-center">
        <img src="src/assets/landing1/landingTitle.png" alt="landingLogo" className="w-2/3 h-auto mb-4" />
        </div>
      </section>

      {/* 두 번째 화면 */}
      <section className="h-screen snap-start flex flex-col">
        <div className="flex-1 flex items-center justify-center gap-15 overflow-hidden">
          <img src="src/assets/landing2/11.png" alt="landingImage" className="h-2/5" />
          <img src="src/assets/landing2/12.png" alt="landingImage" className="h-1/30 w-1/4 mt-8" />
          <img src="src/assets/landing2/13.png" alt="landingImage" className="h-2/3" />
          <img src="src/assets/landing2/14.png" alt="landingImage" className="h-2/5" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-15 overflow-hidden" >
          <img src="src/assets/landing2/21.png" alt="landing2Image" className="h-2/3" />
          <img src="src/assets/landing2/22.png" alt="landing2Image" className="h-2/5" />
          <img src="src/assets/landing2/23.png" alt="landing2Image" className="h-3/5 mt-8" />
          <img src="src/assets/landing2/24.png" alt="landing2Image" className="h-2/3" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-15 overflow-hidden">
          <img src="src/assets/landing2/31.png" alt="landingImage" className="h-2/5" />
          <img src="src/assets/landing2/32.png" alt="landingImage" className="h-3/5" />
          <img src="src/assets/landing2/33.png" alt="landingImage" className="h-2/3" />
          <div className="flex flex-col align-items gap-5">
            <img src="src/assets/landing2/34-1.png" alt="landingImage" className="w-4/6" />
            <img src="src/assets/landing2/34-2.png" alt="landingImage" className="h-3/5 w-3/7 ml-1" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-10 overflow-hidden">
          <img src="src/assets/landing2/41.png" alt="landingImage" className="h-2/5" />
          <img src="src/assets/landing2/42.png" alt="landingImage" className="h-1/30 w-1/5 mt-8" />
          <img src="src/assets/landing2/43.png" alt="landingImage" className="h-2/3" />
          <img src="src/assets/landing2/44.png" alt="landingImage" className="h-2/5" />
        </div>
      </section>

    </div>
  )
}

export default LandingPage
