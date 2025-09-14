import React from 'react'
import Navbar from './navbar'
import HeroSection from './herosection'
import Cache from './cach'
import History from './his'
export default function layout() {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <Cache/>
    {/* <History/> */}
      </>
  )
}
