import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import QuickActions from '@/components/QuickActions'
import CarStory from '@/components/CarStory'
import Services from '@/components/Services'
import WhyRenginal from '@/components/WhyRenginal'
import Process from '@/components/Process'
import Gallery from '@/components/Gallery'
import Location from '@/components/Location'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import MobileActionBar from '@/components/MobileActionBar'

export default function Home() {
  return (
    <>
      <Navigation />

      <main>
        <Hero />
        <QuickActions />
        <CarStory />
        <Services />
        <WhyRenginal />
        <Process />
        <Gallery />
        <Location />
        <Contact />
      </main>

      <Footer />
      <MobileActionBar />
    </>
  )
}
