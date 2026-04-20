'use client'

import dynamic from 'next/dynamic'

const Lanyard = dynamic(() => import('@/components/ui/Lanyard'), {
  ssr: false,
})

export default function IdCard() {
  return (
    <div className="h-[34rem] w-full max-w-[22rem]">
      <Lanyard position={[0, 0, 23]} />
    </div>
  )
}
