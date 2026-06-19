export function StepNumber({ value }: { value: string }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
      {value}
    </span>
  )
}
