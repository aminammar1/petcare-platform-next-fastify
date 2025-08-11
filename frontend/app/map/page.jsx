'use client'
import dynamic from 'next/dynamic'

const Tracker_Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function map_tracking() {
  return <Tracker_Map />
}
