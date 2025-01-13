"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { Button } from "@radix-ui/themes"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

export function Carousel({
  children,
  ...props
}: React.PropsWithChildren<CarouselProps>) {
  const [carouselRef, api] = useEmblaCarousel()
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!api) return

    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        ...props,
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

export function CarouselContent({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  const { carouselRef } = React.useContext(CarouselContext)!

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div className={className}>{children}</div>
    </div>
  )
}

export function CarouselItem({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>
}

export function CarouselPrevious() {
  const { scrollPrev, canScrollPrev } = React.useContext(CarouselContext)!

  return (
    <Button
      variant="ghost"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className="absolute left-4 top-1/2 -translate-y-1/2"
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
}

export function CarouselNext() {
  const { scrollNext, canScrollNext } = React.useContext(CarouselContext)!

  return (
    <Button
      variant="ghost"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
}
