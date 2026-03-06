<script setup lang="ts">
const props = defineProps<{
  testimonials: Array<{
    quote: string
    author: string
    role: string
    linkTo?: string
  }>
}>()

const scrollContainer = ref<HTMLElement>()
const activeIndex = ref(0)

const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function onScroll() {
  const el = scrollContainer.value
  if (!el) return
  const children = el.children
  if (!children.length) return

  const containerRect = el.getBoundingClientRect()
  const containerCenter = containerRect.left + containerRect.width / 2
  let closest = 0
  let closestDist = Infinity

  for (let i = 0; i < children.length; i++) {
    const childRect = (children[i] as HTMLElement).getBoundingClientRect()
    let dist: number
    if (i === 0) {
      dist = Math.abs(childRect.left - containerRect.left)
    }
    else if (i === children.length - 1) {
      dist = Math.abs(childRect.right - containerRect.right)
    }
    else {
      dist = Math.abs(childRect.left + childRect.width / 2 - containerCenter)
    }
    if (dist < closestDist) {
      closestDist = dist
      closest = i
    }
  }
  activeIndex.value = closest

  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

const DRAG_THRESHOLD = 5
let isPointerDown = false
let hasDragged = false
let startX = 0
let startScrollLeft = 0

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  const el = scrollContainer.value
  if (!el) return
  e.preventDefault()
  isPointerDown = true
  hasDragged = false
  startX = e.clientX
  startScrollLeft = el.scrollLeft
  el.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isPointerDown) return
  const el = scrollContainer.value
  if (!el) return
  const dx = e.clientX - startX
  if (!hasDragged && Math.abs(dx) >= DRAG_THRESHOLD) {
    hasDragged = true
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
  }
  if (hasDragged) {
    el.scrollLeft = startScrollLeft - dx
  }
}

function onPointerUp(e: PointerEvent) {
  if (!isPointerDown) return
  isPointerDown = false
  const el = scrollContainer.value
  if (!el) return
  el.releasePointerCapture(e.pointerId)
  el.style.scrollBehavior = ''
  el.style.scrollSnapType = ''
}

function onClickCapture(e: MouseEvent) {
  if (hasDragged) {
    e.preventDefault()
    e.stopPropagation()
  }
}

function scrollTo(index: number) {
  const el = scrollContainer.value
  if (!el) return
  const child = el.children[index] as HTMLElement | undefined
  if (!child) return
  const childRect = child.getBoundingClientRect()
  const containerRect = el.getBoundingClientRect()
  let target: number
  if (index === 0) {
    target = el.scrollLeft + childRect.left - containerRect.left
  }
  else if (index === props.testimonials.length - 1) {
    target = el.scrollLeft + childRect.right - containerRect.right
  }
  else {
    target = el.scrollLeft + (childRect.left + childRect.width / 2) - (containerRect.left + containerRect.width / 2)
  }
  el.scrollTo({ left: target, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <div class="relative">
      <div
        v-if="canScrollLeft"
        class="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent"
      />
      <div
        v-if="canScrollRight && testimonials.length > 1"
        class="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent"
      />
      <div
        ref="scrollContainer"
        class="scrollbar-hide flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth
               select-none active:cursor-grabbing"
        @click.capture="onClickCapture"
        @dragstart.prevent
        @pointercancel="onPointerUp"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @scroll.passive="onScroll"
      >
        <div
          v-for="(t, i) in testimonials"
          :key="i"
          class="w-[85%] flex-shrink-0 sm:w-[70%]"
          :class="i === 0 ? 'snap-start' : i === testimonials.length - 1 ? 'snap-end' : 'snap-center'"
        >
          <TestimonialCard :testimonial="t" />
        </div>
      </div>
    </div>
    <div v-if="testimonials.length > 1" class="mt-4 flex justify-center gap-2">
      <button
        v-for="(_, i) in testimonials"
        :key="i"
        :aria-label="`Go to testimonial ${i + 1}`"
        class="h-2.5 w-2.5 cursor-pointer touch-manipulation rounded-full border-0 p-0 transition-colors"
        :class="i === activeIndex ? 'bg-accent' : 'bg-border hover:bg-text-dim'"
        @click="scrollTo(i)"
      />
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  @apply hidden;
}
</style>
