import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { posterFontSizeOptions } from "@/constants/posterDefaults"

type PosterFontSizeValue = (typeof posterFontSizeOptions)[number]["value"]
type PosterFontSizeOption = (typeof posterFontSizeOptions)[number]

interface FontSizeComboboxProps {
  value: PosterFontSizeValue
  onValueChange: (value: PosterFontSizeValue) => void
  selectLabel: string
  emptyLabel: string
}

export function FontSizeCombobox({
  value,
  onValueChange,
  selectLabel,
  emptyLabel,
}: FontSizeComboboxProps) {
  const selectedOption =
    posterFontSizeOptions.find((option) => option.value === value) ??
    posterFontSizeOptions[0]

  return (
    <Combobox<PosterFontSizeOption>
      items={posterFontSizeOptions}
      value={selectedOption}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      isItemEqualToValue={(option, selected) => option.value === selected.value}
      onValueChange={(option) => {
        if (option) {
          onValueChange(option.value)
        }
      }}
    >
      <ComboboxInput
        id="poster-font-size"
        aria-label={selectLabel}
        className="h-full w-24 border-0 bg-background shadow-none"
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
        <ComboboxList>
          {(option: PosterFontSizeOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
