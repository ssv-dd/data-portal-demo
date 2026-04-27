export interface FormInputProps {
  isReadOnly?: boolean
  isDisabled?: boolean
  isMultiline?: number
}

type BaseSelectOption = {
  value: string
  label: string
  isDisabled?: boolean
  isReadOnly?: boolean
}

type SelectOptionWithData<T> = BaseSelectOption & {
  data: T

  loadOptions?: (filterStr: string) => Promise<SelectOption<T>[]>
}

type SelectOptionNoData = BaseSelectOption & {
  data?: never

  loadOptions?: (filterStr: string) => Promise<SelectOption[]>
}

export type SelectOption<T = undefined> = T extends undefined ? SelectOptionNoData : SelectOptionWithData<T>
