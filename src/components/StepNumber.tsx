export function StepNumber({ value }: { value: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
      {value}
    </span>
  )
}
