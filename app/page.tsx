import Hero from '@/components/home/Hero'
import FeaturedCities from '@/components/home/FeaturedCities'
import { TransparencyBlock } from '@/components/city/TransparencyBlock'
import FeaturedProviders from '@/components/home/FeaturedProviders'
import HowItWorks from '@/components/home/HowItWorks'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCities />
      <TransparencyBlock />
      <FeaturedProviders />
      <HowItWorks />
    </>
  )
}
